import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { apiUrl } from "@/features/api/apiConfig";

const SOCKET_URL = `${apiUrl}/chat`;

export function useChatSocket(
  token: string,
  bookingId: string,
  _workerId?: string,
  _myUserId?: string,
  _workerName?: string
) {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!token || !bookingId) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("booking.chat.join", { bookingId });
    });

    socket.on("booking.chat.message", (payload) => {
      const msg = payload?.message || payload;
      if (!msg?._id) return;

      setMessages((prev) => {
        const map = new Map(prev.map(m => [m._id, m]));

        map.set(msg._id, {
          _id: msg._id,
          id: msg._id,
          text: msg.text,
          senderId: msg.senderId,
          timestamp: msg.createdAt,
        });

        return Array.from(map.values());
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, bookingId]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!socketRef.current) return;

      socketRef.current.emit("booking.chat.send", {
        bookingId,
        text,
      });
    },
    [bookingId]
  );

  return {
    messages,
    sendMessage,
  };
}