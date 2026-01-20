import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "./features/core/store/auth";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { customerData } = useAuthStore();

  const { accessToken, refreshToken, isLoggedIn } = customerData;


  if (!isLoggedIn || !accessToken || !refreshToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
