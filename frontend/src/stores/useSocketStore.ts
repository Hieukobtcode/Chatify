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
    });

    set({ socket });

    socket.on("connect", () => {
      console.log("Connected socket");
    });

    //online users
    socket.on("online-users", (userIds) => {
      set({ onlineUsers: userIds });
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
      set({ socket: null });
    }
  },
}));