import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { Message } from "../../domain/entities/messages";
import { showBrowserNotification } from "@/components/firebase/showBrowserNotification";
import { playNotificationSound } from "@/components/firebase/sound";
const SOCKET_URL = "http://192.168.29.138:4000/chat";

export function useChatSocket(
  token: string,
  bookingId: string,
  workerId?: string,
  myUserId?: string,
  workerName?: string
){
  const socketRef = useRef<Socket | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);

  // ================= CONNECT =================
  useEffect(() => {
    if (!token || !bookingId) return;

    console.log("🚀 Connecting socket...");

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    // 🔌 connect
    socket.on("connect", () => {
      console.log("🟢 Connected:", socket.id);
      setConnected(true);

      console.log("📥 Joining booking room:", bookingId);
      socket.emit("booking.chat.join", { bookingId });
    });

    // 🔴 disconnect
    socket.on("disconnect", () => {
      console.log("🔴 Disconnected");
      setConnected(false);
    });

    // 📩 receive message
   socket.on("booking.chat.message", (payload: any) => {
  const msg = Array.isArray(payload) ? payload[0] : payload;

  console.log("📩 Message received:", msg);

  const isSelf = msg.senderId === myUserId;

  const normalized: Message = {
    ...msg,
    _id: msg._id || `${Date.now()}-${Math.random()}`,
    timestamp: msg.timestamp || new Date().toISOString(),
    self: isSelf,
    status: "sent",
  };

  setMessages((prev) => {
    // ✅ remove matching optimistic temp message
    const filtered = prev.filter((m) => {
      const sameMessage =
        m.text === normalized.text &&
        m.senderId === normalized.senderId &&
        m._id?.startsWith("temp-");

      return !sameMessage;
    });

    // ✅ avoid exact duplicate
    const exists = filtered.some((m) => m._id === normalized._id);

    if (exists) return filtered;

    return [...filtered, normalized];
  });

  // 🔔 notification only for others
  if (!isSelf) {
    playNotificationSound();

    showBrowserNotification({
      notification: {
        title: `New message from ${workerName || "Worker"}`,
        body: msg.text || "You have a new chat message",
      },
      data: {
        url: `/message/${workerId}/${bookingId}`,
        id: `chat-${bookingId}-${normalized._id}`,
      },
    });
  }
});
    // ❌ errors
    socket.on("connect_error", (err) => {
      console.log("❌ Socket error:", err.message);
    });

    // 🧪 debug
    socket.onAny((event, ...args) => {
      console.log("📡 EVENT:", event, args);
    });

    return () => {
      console.log("🧹 Cleaning socket");

      socket.emit("booking.chat.leave", { bookingId });

      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [token, bookingId, workerId, myUserId]);

  // ================= SEND MESSAGE =================
const sendMessage = useCallback(
  (text: string) => {
    if (!socketRef.current || !text.trim()) return;

    const optimisticMessage: Message = {
      _id: `temp-${Date.now()}`,
      text,
      senderId: myUserId || "",
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    console.log("📤 Sending:", {
      bookingId,
      text,
    });

    socketRef.current.emit("booking.chat.send", {
      bookingId,
      text,
    });
  },
  [bookingId, myUserId]
);

  return {
    messages,
    connected,
    sendMessage,
    setMessages, // optional for initial history injection
  };
}