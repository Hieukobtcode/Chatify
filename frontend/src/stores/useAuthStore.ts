import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";
import { persist } from "zustand/middleware";
import { useChatStore } from "./useChatStore";

export const useAuthStore = create<AuthState>()(
  persist((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    setAccessToken: (accessToken) => {
      set({ accessToken });
    },

     setUser: (user) => {
        set({ user });
      },

    clearState: () => {
      set({ accessToken: null, user: null, loading: false });
      useChatStore.getState().reset();

      // Lưu theme trước khi xoá localStorage để không mất dark mode
      const themeData = localStorage.getItem("theme-storage");

      localStorage.clear();
      sessionStorage.clear();

      // Khôi phục theme sau khi clear
      if (themeData) {
        localStorage.setItem("theme-storage", themeData);
      }
    },

    signUp: async (username, password, email, firstName, lastName) => {
      try {
        set({ loading: true });

        //  gọi api
        await authService.signUp(username, password, email, firstName, lastName);

        toast.success("Đăng ký thành công!");
        return true;
      } catch (error: any) {
        console.error(error);

        const serverMessage =
          error?.response?.data?.message || "Đăng ký không thành công";
        toast.error(serverMessage);

        return false;
      } finally {
        set({ loading: false });
      }
    },

    signIn: async (username, password) => {
      try {
        get().clearState();
        set({ loading: true });

        const { accessToken } = await authService.signIn(username, password);
        get().setAccessToken(accessToken);

        await get().fetchMe();
        useChatStore.getState().fetchConversatons();

        toast.success("Chào mừng bạn quay lại với Chatify!");
        return true;
      } catch (error: any) {
        console.error(error);

        const serverMessage =
          error?.response?.data?.message || "Đăng nhập không thành công!";
        toast.error(serverMessage);

        return false;
      } finally {
        set({ loading: false });
      }
    },

    signOut: async () => {
      try {
        get().clearState();
        await authService.signOut();
        toast.success("Logout thành công!");
      } catch (error) {
        console.error(error);
        toast.error("Lỗi xảy ra khi logout. Hãy thử lại!");
      }
    },

    fetchMe: async () => {
      try {
        set({ loading: true });
        const user = await authService.fetchMe();

        set({ user });
      } catch (error) {
        console.error(error);
        set({ user: null });
        toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!");
      } finally {
        set({ loading: false });
      }
    },

    refresh: async () => {
      try {
        set({ loading: true });
        const { user, fetchMe, setAccessToken } = get();
        const accessToken = await authService.refresh();

        setAccessToken(accessToken);

        if (!user) {
          await fetchMe();
        }
      } catch (error: any) {
        console.error(error);
        // 401 = không có cookie → user đã logout, không cần toast
        // 403 = token hết hạn / không hợp lệ → cần thông báo
        if (error?.response?.status !== 401) {
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        }
        get().clearState();
      } finally {
        set({ loading: false });
      }
    },
  }), {
    name: "auth-storage",
    partialize: (state) => ({ user: state.user })
  })
);