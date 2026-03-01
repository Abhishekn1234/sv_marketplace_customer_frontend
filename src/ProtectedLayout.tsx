import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "./features/core/store/auth";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user,accessToken,refreshToken,isLoggedIn } = useAuthStore();

  


  if (!isLoggedIn || !accessToken || !refreshToken || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
