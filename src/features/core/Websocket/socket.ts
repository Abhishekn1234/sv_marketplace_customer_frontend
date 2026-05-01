import { io, Socket } from "socket.io-client";
import apiClient from "@/features/api/interceptor";

let socket: Socket | null = null;

export const initializeSocket = (token: string): Socket => {
  const baseURL = apiClient.defaults.baseURL;

  // ✅ Reconnect safely if needed
  if (socket) {
    if (socket.connected) return socket;

    socket.disconnect();
    socket = null;
  }

  socket = io(`${baseURL}/customers`, {
    transports: ["websocket"],
    withCredentials: true,
    auth: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket?.id);
  });
  socket.onAny((event, data) => {
  if (!event.startsWith("booking") && !event.startsWith("customer")) return;

  console.log("📡 [CUSTOMER SOCKET]", {
    event,
    data,
  });
});

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.log("🔥 Socket error:", err.message);
  });

  // 🔍 Debug all events
  socket.onAny((event, data) => {
    console.log("📡 Event:", event, data);
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};