import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import type { SocketState } from "@/types/store";
import { useChatStore } from "./useChatStore";

const baseURL = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  onlineUsers: [],

  connectSocket: () => {
    const accessToken = useAuthStore.getState().accessToken;
    const existingSocket = get().socket;

    if (existingSocket) return; //tranh tao nhieu socket

    const socket: Socket = io(baseURL, {
      auth: { token: accessToken },
      transports: ["websocket"],
      // Giảm thời gian kết nối lại
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    set({ socket });

    socket.on("connect", () => {
      console.log("Connected socket");
    });

    //online users - nhận danh sách ban đầu
    socket.on("online-users", (userIds) => {
      set({ onlineUsers: userIds });
    });

    //user online - thêm user vào danh sách
    socket.on("user-online", (userId) => {
      set((state) => {
        if (state.onlineUsers.includes(userId)) return state;
        return { onlineUsers: [...state.onlineUsers, userId] };
      });
    });

    //user offline - xoá user khỏi danh sách
    socket.on("user-offline", (userId) => {
      set((state) => ({
        onlineUsers: state.onlineUsers.filter((id) => id !== userId),
      }));
    });

    //new message
    socket.on("new-message", ({ message, conversation, unreadCounts }) => {
      useChatStore.getState().addMessage(message);

      const lastMessage = {
        _id: conversation.lastMessage._id,
        content: conversation.lastMessage.content,
        imgUrl: conversation.lastMessage.imgUrl || null,
        fileUrl: conversation.lastMessage.fileUrl || null,
        fileName: conversation.lastMessage.fileName || null,
        fileType: conversation.lastMessage.fileType || null,
        audioUrl: conversation.lastMessage.audioUrl || null,
        audioDuration: conversation.lastMessage.audioDuration || null,
        createdAt: conversation.lastMessage.createdAt,
        sender: {
          _id: conversation.lastMessage.senderId,
          displayName: "",
          avatarUrl: null,
        },
      };

      const updateConversation = {
        ...conversation,
        lastMessage,
        unreadCounts,
      };

      if (
        useChatStore.getState().activeConversationId === message.conversationId
      ) {
        //danh dau da doc
        useChatStore.getState().markAsSeen();
      }

      useChatStore.getState().updateConversation(updateConversation);
    });

    //read message
    socket.on("read-message", ({ conversation, lastMessage }) => {
      const updated = {
        ...conversation,
        lastMessage,
        unreadCounts: conversation.unreadCounts,
      };

      useChatStore.getState().updateConversation(updated);
    });

    //reaction
    socket.on("message-reaction", ({ messageId, reactions }) => {
      useChatStore.getState().updateMessageReactions(messageId, reactions);
    });

    //new group chat
    socket.on('new-group', (conversation) => {
      useChatStore.getState().addConvo(conversation);
      socket.emit("join-conversation",conversation._id);
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },
}));