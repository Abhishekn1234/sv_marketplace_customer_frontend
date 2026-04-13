import apiClient from "@/features/api/interceptor";
import { io, Socket } from "socket.io-client";


let socket: Socket | null = null;

export const initializeSocket = (token: string) => {
  if (socket) return socket;

  let baseURL = apiClient.defaults.baseURL;

  socket = io(`${baseURL}/customers`, {
    transports: ["websocket"],
    withCredentials: true,
    auth: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log("✅ Connected:", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.log("🔥 Connect error:", err.message);
  });

  return socket;
};

export const getSocket = () => socket;