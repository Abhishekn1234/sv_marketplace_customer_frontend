import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "./features/core/store/auth";

export const ProtectedRoute = () => {
  const { user, accessToken, refreshToken, isLoggedIn } = useAuthStore();

  if (!isLoggedIn || !accessToken || !refreshToken || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};