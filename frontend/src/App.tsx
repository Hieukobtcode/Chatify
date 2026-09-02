import { BrowserRouter, Route, Routes } from "react-router";
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useThemeStore } from "./stores/useThemeStore";
import { useAuthStore } from "./stores/useAuthStore";
import { useSocketStore } from "./stores/useSocketStore";

// Lazy load pages - chỉ tải khi cần thiết
const SignInPage = lazy(() => import("./pages/SignInPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const ChatAppPage = lazy(() => import("./pages/ChatAppPage"));

// Loading fallback nhẹ
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

function App() {
  const { isDark, setTheme } = useThemeStore();
  const { accessToken } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    if (accessToken) {
      connectSocket();
    }

    return () => disconnectSocket();
  }, [accessToken]);

  return (
    <>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* public routes */}
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<ChatAppPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;