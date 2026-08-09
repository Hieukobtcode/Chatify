import api from "@/lib/axios";

export const friendService = {
  async searchByUserName(username: string) {
    const res = await api.get(`/users/search?username=${username}`);
    return res.data.user;
  },

  async sendFriendRequest(to: string, message?: string) {
    const res = await api.post("/friend/request", { to, message });
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
      const res = await api.post(`/friends/request/${requestId}/accept`);
      return res.data.requestAcceptedBy;
    } catch (error) {
      console.error("Loi khi gui accept request:", error);
    }
  },

  async declineRequest(requestId: string) {
    try {
      const res = await api.post(`/friends/request/${requestId}/decline`);
    } catch (error) {
      console.error("Loi khi gui declien request:", error);
    }
  },
};
