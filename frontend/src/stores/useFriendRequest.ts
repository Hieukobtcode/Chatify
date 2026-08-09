import { friendService } from "@/services/friendService";
import type { FriendState } from "@/types/store";
import { create } from "zustand";

export const useFriendStore = create<FriendState>((set, get) => ({
  loading: false,
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
      return "Lỗi xảy ra khi gửi kết bạn hãy thử lại"
    } finally {
      set({ loading: false });
    }
  },
}));
