import { friendService } from "@/services/friendService";
import type { FriendState } from "@/types/store";
import { create } from "zustand";

export const useFriendStore = create<FriendState>((set) => ({
  friends: [],
  loading: false,
  receivedList: [],
  sendList: [],
  searchByUserName: async (username) => {
    try {
      set({ loading: true });

      const user = await friendService.searchByUserName(username);

      return user;
    } catch (error) {
      console.error("Loi xay ra khi tim user bawng username:", error);
      return null;
    } finally {
      set({ loading: false });
    }
  },
  addFriend: async (to, message) => {
    try {
      set({ loading: true });
      const result = await friendService.sendFriendRequest(to, message);
      return result;
    } catch (error) {
      console.error("Loi xay ra khi add Friend:", error);
      return "Lỗi xảy ra khi gửi kết bạn hãy thử lại";
    } finally {
      set({ loading: false });
    }
  },

  getAllFriendRequest: async () => {
    try {
      set({ loading: true });

      const result = await friendService.getAllFriendReqiest();

      if (!result) return;

      const { received, sent } = result;

      set({ receivedList: received, sendList: sent });

    } catch (error) {
      console.error("Loi xay ra khi get all friend:", error)
    } finally {
      set({ loading: false })
    }
  },

  acceptRequest: async (requestId) => {
    try {
      set({ loading: true });

      const data = await friendService.acceptRequest(requestId);
      const newFriend = data?.newFriend;

      set((state) => ({
        receivedList: state.receivedList.filter((r) => r._id !== requestId),
        friends: newFriend ? [...state.friends, newFriend] : state.friends,
      }))
    } catch (error) {
      console.error("Loi khi chap nhan yeu cau ket ban:", error)
      throw error;
    } finally {
      set({ loading: false })
    }
  },

  declineRequest: async (requestId) => {
    try {
      set({ loading: true })

      await friendService.declineRequest(requestId);

      set((state) => ({
        receivedList: state.receivedList.filter((r) => r._id !== requestId)
      }))
    } catch (error) {
      console.error("Loi khi tu choi loi moi ket ban:", error)
      throw error;
    } finally {
      set({ loading: false })
    }
  },

  getFriends: async () => {
    try {
      set({ loading: true })
      const friends = await friendService.getFriendList();
      set({ friends: friends })
    } catch (error) {
      console.log("Loi xay ra khi load friends:", error)
      set({ friends: [] })
    } finally {
      set({ loading: false })
    }
  }
}));