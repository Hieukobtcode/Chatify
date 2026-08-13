import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useRef, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { LoaderIcon } from "lucide-react";

const ProtectedRoute = () => {
  const { accessToken, loading, refresh, fetchMe, clearState } =
    useAuthStore();
  const [starting, setStarting] = useState(true);
  const initialized = useRef(false);

  const init = async () => {
    if (initialized.current) return;
    initialized.current = true;

    try {
      if (!accessToken) {
        await refresh();
      }

      const state = useAuthStore.getState();

      if (state.accessToken && !state.user) {
        await fetchMe();
      }
    } catch {
      clearState();
    } finally {
      setStarting(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  if (starting || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderIcon
          role="status"
          aria-label="Loading"
          className="size-4 animate-spin dark:text-white"
        />
      </div>
    );
  }

  if (!accessToken) {
    return (
      <Navigate
        to="/signin"
        replace
      />
    );
  }

  return <Outlet></Outlet>;
};

export default ProtectedRoute;