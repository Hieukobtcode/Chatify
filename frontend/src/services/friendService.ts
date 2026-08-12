import api from "@/lib/axios";

export const friendService = {
  async searchByUserName(username: string) {
    const res = await api.get(`/users/search?username=${username}`);
    return res.data.user;
  },

  async sendFriendRequest(to: string, message?: string) {
    const res = await api.post("/friends/requests", { to, message });
    return res.data.message;
  },

  async getAllFriendReqiest() {
    try {
      const res = await api.get("/friends/requests");
      const { sent, received } = res.data;
      return { sent, received };
    } catch (error) {
      console.error("Loi khi gui get all friend request:", error);
    }
  },

  async acceptRequest(requestId: string) {
    try {
      const res = await api.post(`/friends/requests/${requestId}/accept`);
      return res.data;
    } catch (error) {
      console.error("Loi khi gui accept request:", error);
      throw error;
    }
  },

  async declineRequest(requestId: string) {
    try {
      await api.post(`/friends/requests/${requestId}/decline`);
    } catch (error) {
      console.error("Loi khi gui decline request:", error);
      throw error;
    }
  },

  async getFriendList() {
    const res = await api.get("/friends");
    return res.data.friends;
  }
};