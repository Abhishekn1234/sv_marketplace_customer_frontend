import { type JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const customerDataRaw = localStorage.getItem("customerData");

  if (!customerDataRaw) {
    // No user data, redirect to login
    return <Navigate to="/login" replace />;
  }

  try {
    const customerData = JSON.parse(customerDataRaw) as {
      accessToken?: string;
      refreshToken?: string;
      [key: string]: any;
    };

    // Ensure both tokens exist
    if (!customerData.accessToken || !customerData.refreshToken) {
      return <Navigate to="/login" replace />;
    }

    // Valid tokens, render protected route
    return children;
  } catch (e) {
    // Invalid JSON, redirect to login
    return <Navigate to="/login" replace />;
  }
};
