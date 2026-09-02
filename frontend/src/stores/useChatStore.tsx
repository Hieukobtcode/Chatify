import { chatService } from "@/services/chatService";
import type { ChatState } from "@/types/store";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { useSocketStore } from "./useSocketStore";

export const useChatStore = create<ChatState>()((set, get) => ({
  conversations: [],
  messages: {},
  activeConversationId: null,
  convoLoading: false,
  messageLoading: false,
  loading: false,

  setActiveConversation: (id) => set({ activeConversationId: id }),

  reset: () => {
    set({
      conversations: [],
      messages: {},
      activeConversationId: null,
      convoLoading: false,
      messageLoading: false,
    });
  },

  fetchConversatons: async () => {
    try {
      set({ convoLoading: true });
      const { conversations } = await chatService.fetchConversations();
      set({ conversations, convoLoading: false });
    } catch (error) {
      console.error("Lỗi xảy ra khi fetchConversation:", error);
      set({ convoLoading: false });
    }
  },

  fetchMessage: async (conversationId) => {
    const { activeConversationId, messages } = get();
    const { user } = useAuthStore.getState();

    const convoId = conversationId ?? activeConversationId;

    if (!convoId) return;

    const current = messages?.[convoId];
    const nextCursor =
      current?.nextCursor === undefined ? "" : current?.nextCursor;

    if (nextCursor === null) return;

    set({ messageLoading: true });

    try {
      const { messages: fetched, cursor } = await chatService.fetchMessage(
        convoId,
        nextCursor,
      );
      const processed = fetched.map((m) => ({
        ...m,
        isOwn: m.senderId === user?._id,
      }));

      set((state) => {
        const prev = state.messages[convoId]?.items ?? [];
        const merged =
          prev.length > 0 ? [...processed, ...prev] : processed;

        return {
          messages: {
            ...state.messages,
            [convoId]: {
              items: merged,
              hasMore: !!cursor,
              nextCursor: cursor ?? null,
            },
          },
        };
      });
    } catch (error) {
      console.error("Loi xay ra khi fetch Message:", error);
    } finally {
      set({ messageLoading: false });
    }
  },

  sendDirectMessage: async (
    recipientId,
    content,
    imgUrl,
    attachment,
    audio,
  ) => {
    try {
      const { activeConversationId } = get();
      await chatService.sendDirectMessage(
        recipientId,
        content,
        imgUrl,
        activeConversationId || undefined,
        attachment,
        audio,
      );
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c._id === activeConversationId ? { ...c, seenBy: [] } : c,
        ),
      }));
    } catch (error) {
      console.error("Loi xay ra khi gui direct message:", error);
    }
  },

  sendGroupMessage: async (
    conversationId,
    content,
    imgUrl,
    attachment,
    audio,
  ) => {
    try {
      await chatService.sendGroupMessage(
        conversationId,
        content,
        imgUrl,
        attachment,
        audio,
      );
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c._id === get().activeConversationId ? { ...c, seenBy: [] } : c,
        ),
      }));
    } catch (error) {
      console.log("Loi xay ra khi gui gropu message:", error);
    }
  },

  addMessage: async (message) => {
    try {
      const { user } = useAuthStore.getState();

      message.isOwn = message.senderId === user?._id;

      const convoId = message.conversationId;

      const current = get().messages[convoId];

      // Nếu chưa load messages cho conversation này, không cần fetch - chỉ cập nhật conversation
      if (!current || current.items.length === 0) {
        return;
      }

      set((state) => {
        const preItems = state.messages[convoId]?.items ?? [];

        // Tin nhắn đã tồn tại
        if (preItems.some((m) => m._id === message._id)) {
          return state;
        }

        const currentConversation = state.messages[convoId];

        return {
          messages: {
            ...state.messages,
            [convoId]: {
              items: [...preItems, message],
              hasMore: currentConversation?.hasMore ?? false,
              nextCursor: currentConversation?.nextCursor ?? null,
            },
          },
        };
      });
    } catch (error) {
      console.log("Lỗi xảy ra khi add message:", error);
    }
  },

  toggleReaction: async (messageId, emoji) => {
    try {
      const res = await chatService.toggleReaction(messageId, emoji);
      get().updateMessageReactions(res.messageId, res.reactions);
    } catch (error) {
      console.error("Lỗi xảy ra khi reaction:", error);
    }
  },

  updateMessageReactions: (messageId, reactions) => {
    set((state) => {
      // Chỉ cập nhật conversation chứa message thay vì duyệt tất cả
      let found = false;
      const nextMessages: ChatState["messages"] = {};

      for (const [convoId, convo] of Object.entries(state.messages)) {
        if (found) {
          nextMessages[convoId] = convo;
          continue;
        }

        const hasMessage = convo.items.some((m) => m._id === messageId);
        if (hasMessage) {
          found = true;
          nextMessages[convoId] = {
            ...convo,
            items: convo.items.map((m) =>
              m._id === messageId ? { ...m, reactions } : m,
            ),
          };
        } else {
          nextMessages[convoId] = convo;
        }
      }

      return { messages: nextMessages };
    });
  },

  updateConversation: (conversation) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c._id === conversation._id ? { ...c, ...conversation } : c,
      ),
    }));
  },

  markAsSeen: async () => {
    try {
      const { user } = useAuthStore.getState();
      const { activeConversationId, conversations } = get();

      if (!activeConversationId || !user) {
        return;
      }

      const convo = conversations.find(
        (c) => c._id === activeConversationId,
      );

      if (!convo) {
        return;
      }

      if ((convo.unreadCounts?.[user._id] ?? 0) === 0) {
        return;
      }

      await chatService.markAsSeen(activeConversationId);

      set((state) => ({
        conversations: state.conversations.map((c) =>
          c._id === activeConversationId && c.lastMessage
            ? {
                ...c,
                unreadCounts: {
                  ...c.unreadCounts,
                  [user._id]: 0,
                },
              }
            : c,
        ),
      }));
    } catch (error) {
      console.error("Loi xay ra khi goi mark as seen", error);
    }
  },

  addConvo: (convo) => {
    set((state) => {
      const exists = state.conversations.some(
        (c) => c._id.toString() === convo._id.toString(),
      );
      return {
        conversations: exists
          ? state.conversations
          : [convo, ...state.conversations],
        activeConversationId: convo._id,
      };
    });
  },

  createConversation: async (type, name, memberIds) => {
    try {
      set({ loading: true });
      const conversation = await chatService.createConversation(
        type,
        name,
        memberIds,
      );
      get().addConvo(conversation);
      useSocketStore
        .getState()
        .socket?.emit("join-conversation", conversation._id);
    } catch (error) {
      console.log("Loi xay ra khi goi createConversation:", error);
    } finally {
      set({ loading: false });
    }
  },
}));