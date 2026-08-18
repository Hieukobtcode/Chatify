import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import path from "path";
import { randomUUID } from "crypto";
import {
  emitNewMessage,
  updateConversationAfterCreateMessage,
} from "../utils/messageHelper.js";
import { io } from "../socket/index.js";
import {
  uploadImageMessageFromBuffer,
  uploadFileMessageFromBuffer,
  uploadAudioMessageFromBuffer,
} from "../middlewares/uploadMiddleware.js";

export const sendDirectMessage = async (req, res) => {
  try {
    const {
      recipientId,
      content,
      conversationId,
      imgUrl,
      fileUrl,
      fileName,
      fileSize,
      fileType,
      audioUrl,
      audioDuration,
    } = req.body;
    const senderId = req.user._id;

    let conversation;

    if (!conversationId && !recipientId) {
      return res
        .status(400)
        .json({ message: "Thiếu recipientId hoặc conversationId" });
    }

    if ((!content || !content.trim()) && !imgUrl && !fileUrl && !audioUrl) {
      return res.status(400).json({ message: "Thiếu nội dung" });
    }

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      conversation = await Conversation.create({
        type: "direct",
        participants: [
          { userId: senderId, joinedAt: new Date() },
          { userId: recipientId, joinedAt: new Date() },
        ],
        lastMessageAt: new Date(),
        unreadCounts: new Map(),
      });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content: content?.trim() ? content.trim() : null,
      imgUrl: imgUrl || null,
      fileUrl: fileUrl || null,
      fileName: fileName || null,
      fileSize: fileSize || null,
      fileType: fileType || null,
      audioUrl: audioUrl || null,
      audioDuration: audioDuration || null,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);

    await conversation.save();

    emitNewMessage(io, conversation, message);

    return res.status(201).json({ message });
  } catch (error) {
    console.error("Lỗi xảy ra khi gửi tin nhắn trực tiếp", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const {
      conversationId,
      content,
      imgUrl,
      fileUrl,
      fileName,
      fileSize,
      fileType,
      audioUrl,
      audioDuration,
    } = req.body;
    const senderId = req.user._id;
    const conversation = req.conversation;

    if ((!content || !content.trim()) && !imgUrl && !fileUrl && !audioUrl) {
      return res.status(400).json({ message: "Thiếu nội dung" });
    }

    const message = await Message.create({
      conversationId,
      senderId,
      content: content?.trim() ? content.trim() : null,
      imgUrl: imgUrl || null,
      fileUrl: fileUrl || null,
      fileName: fileName || null,
      fileSize: fileSize || null,
      fileType: fileType || null,
      audioUrl: audioUrl || null,
      audioDuration: audioDuration || null,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);

    await conversation.save();
    emitNewMessage(io, conversation, message);

    return res.status(201).json({ message });
  } catch (error) {
    console.error("Lỗi xảy ra khi gửi tin nhắn nhóm", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const uploadMessageImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadImageMessageFromBuffer(file.buffer);

    return res.status(200).json({
      imgUrl: result.secure_url,
      imgId: result.public_id,
    });
  } catch (error) {
    console.error("Lỗi xảy ra khi upload ảnh tin nhắn:", error);
    return res.status(500).json({ message: "Upload ảnh thất bại" });
  }
};

export const uploadMessageAudio = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No audio uploaded" });
    }

    const result = await uploadAudioMessageFromBuffer(file.buffer);

    return res.status(200).json({
      audioUrl: result.secure_url,
      audioId: result.public_id,
      audioDuration: result.duration || 0,
    });
  } catch (error) {
    console.error("Lỗi xảy ra khi upload audio:", error);
    return res.status(500).json({ message: "Upload audio thất bại" });
  }
};

export const uploadMessageFile = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const ext = path.extname(file.originalname);
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "")
      .slice(0, 80);
    const publicId = `${baseName || "file"}-${randomUUID()}${ext}`;

    const result = await uploadFileMessageFromBuffer(file.buffer, {
      public_id: publicId,
    });

    return res.status(200).json({
      fileUrl: result.secure_url,
      fileId: result.public_id,
      fileName: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype,
    });
  } catch (error) {
    console.error("Lỗi xảy ra khi upload file:", error);
    return res.status(500).json({ message: "Upload file thất bại" });
  }
};

const formatReactions = (reactions) =>
  (reactions || []).map((r) => ({
    userId: r.userId.toString(),
    emoji: r.emoji,
  }));

export const toggleMessageReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    if (!emoji || typeof emoji !== "string") {
      return res.status(400).json({ message: "Thiếu emoji" });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Không tìm thấy tin nhắn" });
    }

    if (!Array.isArray(message.reactions)) {
      message.reactions = [];
    }

    const conversation = await Conversation.findById(message.conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Không tìm thấy cuộc trò chuyện" });
    }

    const isMember = conversation.participants.some(
      (p) => p.userId.toString() === userId.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: "Bạn không ở trong cuộc trò chuyện này" });
    }

    const existingIndex = message.reactions.findIndex(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingIndex !== -1) {
      if (message.reactions[existingIndex].emoji === emoji) {
        message.reactions.splice(existingIndex, 1);
      } else {
        message.reactions[existingIndex].emoji = emoji;
      }
    } else {
      message.reactions.push({ userId, emoji });
    }

    await message.save();

    const reactions = formatReactions(message.reactions);

    io.to(message.conversationId.toString()).emit("message-reaction", {
      messageId: message._id.toString(),
      reactions,
    });

    return res.status(200).json({
      messageId: message._id.toString(),
      reactions,
    });
  } catch (error) {
    console.error("Lỗi xảy ra khi reaction tin nhắn:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
