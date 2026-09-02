import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { io } from "../socket/index.js";

const PARTICIPANT_SELECT = "displayName avatarUrl";
const CONVERSATION_SELECT = {
  type: 1,
  participants: 1,
  group: 1,
  lastMessageAt: 1,
  seenBy: 1,
  lastMessage: 1,
  unreadCounts: 1,
  updatedAt: 1,
};

export const createConversation = async (req, res) => {
  try {
    const { type, name, memberIds } = req.body;
    const userId = req.user._id;

    if (
      !type ||
      (type === "group" && !name) ||
      !memberIds ||
      !Array.isArray(memberIds) ||
      memberIds.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Tên nhóm và danh sách thành viên là bắt buộc" });
    }

    let conversation;

    if (type === "direct") {
      const participantId = memberIds[0];

      conversation = await Conversation.findOne({
        type: "direct",
        "participants.userId": { $all: [userId, participantId] },
      }).lean();

      if (!conversation) {
        conversation = new Conversation({
          type: "direct",
          participants: [{ userId }, { userId: participantId }],
          lastMessageAt: new Date(),
        });

        await conversation.save();
      }
    }

    if (type === "group") {
      conversation = new Conversation({
        type: "group",
        participants: [{ userId }, ...memberIds.map((id) => ({ userId: id }))],
        group: {
          name,
          createdBy: userId,
        },
        lastMessageAt: new Date(),
      });

      await conversation.save();
    }

    if (!conversation) {
      return res.status(400).json({ message: "Conversation type không hợp lệ" });
    }

    // Populate thông tin participants
    const populated = await Conversation.populate(conversation, [
      { path: "participants.userId", select: PARTICIPANT_SELECT },
      { path: "seenBy", select: PARTICIPANT_SELECT },
      { path: "lastMessage.senderId", select: PARTICIPANT_SELECT },
    ]);

    const participants = (populated.participants || []).map((p) => ({
      _id: p.userId?._id,
      displayName: p.userId?.displayName,
      avatarUrl: p.userId?.avatarUrl ?? null,
      joinedAt: p.joinedAt,
    }));

    const formatted = { ...populated, participants };

    if (type === "group") {
      memberIds.forEach((userId) => {
        io.to(userId).emit("new-group", formatted);
      });
    }

    if (type === "direct") {
      io.to(userId).emit("new-group", formatted);
      io.to(memberIds[0]).emit("new-group", formatted);
    }

    return res.status(201).json({ conversation: formatted });
  } catch (error) {
    console.error("Lỗi khi tạo conversation", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find(
      { "participants.userId": userId },
      CONVERSATION_SELECT
    )
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .populate({
        path: "participants.userId",
        select: PARTICIPANT_SELECT,
      })
      .populate({
        path: "lastMessage.senderId",
        select: PARTICIPANT_SELECT,
      })
      .populate({
        path: "seenBy",
        select: PARTICIPANT_SELECT,
      })
      .lean();

    const formatted = conversations.map((convo) => {
      const participants = (convo.participants || []).map((p) => ({
        _id: p.userId?._id,
        displayName: p.userId?.displayName,
        avatarUrl: p.userId?.avatarUrl ?? null,
        joinedAt: p.joinedAt,
      }));

      return {
        ...convo,
        unreadCounts: convo.unreadCounts || {},
        participants,
      };
    });

    return res.status(200).json({ conversations: formatted });
  } catch (error) {
    console.error("Lỗi xảy ra khi lấy conversations", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, cursor } = req.query;

    const query = { conversationId };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    // Chỉ lấy các field cần thiết, dùng lean() để tăng tốc
    let messages = await Message.find(query, {
      conversationId: 1,
      senderId: 1,
      content: 1,
      imgUrl: 1,
      fileUrl: 1,
      fileName: 1,
      fileSize: 1,
      fileType: 1,
      audioUrl: 1,
      audioDuration: 1,
      reactions: 1,
      createdAt: 1,
    })
      .sort({ createdAt: -1 })
      .limit(Number(limit) + 1)
      .lean();

    let nextCursor = null;

    if (messages.length > Number(limit)) {
      const nextMessage = messages[messages.length - 1];
      nextCursor = nextMessage.createdAt.toISOString();
      messages.pop();
    }

    messages = messages.reverse();

    return res.status(200).json({
      messages,
      nextCursor,
    });
  } catch (error) {
    console.error("Lỗi xảy ra khi lấy messages", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getUserConversationsForSocketIO = async (userId) => {
  try {
    const conversations = await Conversation.find(
      { "participants.userId": userId },
      { _id: 1 },
    ).lean();

    return conversations.map((c) => c._id.toString());
  } catch (error) {
    console.error("Lỗi khi fetch conversations: ", error);
    return [];
  }
};

export const markAsSeen = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id.toString();

    const conversation = await Conversation.findById(conversationId).lean();

    if (!conversation) {
      return res.status(404).json({ message: "Conversation khong ton tai" })
    }

    const last = conversation.lastMessage;

    if (!last) {
      return res.status(200).json({ message: "Khong co tin nhan de mark as seen" })
    }

    if (last.senderId.toString() === userId) {
      return res.status(200).json({ message: "Sender khong can mark as seen" })
    }

    const updated = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $addToSet: { seenBy: userId },
        $set: { [`unreadCounts.${userId}`]: 0 },
      }, {
      new: true
    }
    ).populate([
      { path: "participants.userId", select: PARTICIPANT_SELECT },
      { path: "lastMessage.senderId", select: PARTICIPANT_SELECT },
    ]).lean()

    const formattedParticipants = (updated.participants || []).map((p) => ({
      _id: p.userId?._id,
      displayName: p.userId?.displayName,
      avatarUrl: p.userId?.avatarUrl ?? null,
      joinedAt: p.joinedAt,
    }))

    io.to(conversationId).emit("read-message", {
      conversation: {
        ...updated,
        participants: formattedParticipants,
      },
      lastMessage: {
        _id: updated?.lastMessage._id,
        content: updated?.lastMessage.content,
        imgUrl: updated?.lastMessage.imgUrl || null,
        fileUrl: updated?.lastMessage.fileUrl || null,
        fileName: updated?.lastMessage.fileName || null,
        fileType: updated?.lastMessage.fileType || null,
        audioUrl: updated?.lastMessage.audioUrl || null,
        audioDuration: updated?.lastMessage.audioDuration || null,
        createdAt: updated?.lastMessage.createdAt,
        sender: {
          _id: updated?.lastMessage.senderId
        }
      }
    })

    return res.status(200).json({
      message: "Marked as seen",
      seenBy: updated?.seenBy || [],
      myUnreadCount: updated?.unreadCounts[userId] || 0,
    })
  } catch (error) {
    console.error("Loi khi mark as seen:", error);
    return res.status(500).json({ message: "Loi he thong" })
  }
}