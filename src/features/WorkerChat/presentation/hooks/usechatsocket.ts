import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

import { io, Socket } from "socket.io-client";

import type { Message } from "../../domain/entities/messages";

import { apiUrl } from "@/features/api/apiConfig";
import { mergeMessages } from "../utils/mergemessages";
import { unpackMessages } from "../utils/unpackmessages";
import { normalizeMessage } from "../utils/normalizemessages";
import { playNotificationSound } from "@/components/firebase/sound";

const SOCKET_URL = `${apiUrl}/chat`;

// =========================
// SOCKET HOOK
// =========================

export function useChatSocket(
  token: string,
  bookingId: string,
  workerId?: string,
  myUserId?: string,
  workerName?: string,
  initialMessage?: Message | null
) {
  const socketRef = useRef<Socket | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);

  // =========================
  // INITIAL MESSAGE (FIXED)
  // =========================

  useEffect(() => {
    if (!initialMessage) {
      setMessages([]);
      return;
    }

    setMessages([initialMessage]);
  }, [initialMessage, bookingId]);

  // =========================
  // SOCKET CONNECTION
  // =========================

  useEffect(() => {
    if (!token || !bookingId) return;

    // 🔴 CLEAN OLD SOCKET BEFORE NEW CONNECTION
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    // =========================
    // MESSAGE HANDLER
    // =========================

    const addMessages = (payload: any, notify = false) => {
      const normalized = unpackMessages(payload)
        .map((msg) => normalizeMessage(msg, myUserId))
        .filter((msg) => msg.text?.trim().length > 0);

      if (!normalized.length) return;

      setMessages((prev) => mergeMessages(prev, normalized));

      // =========================
      // NOTIFICATIONS (FIXED)
      // =========================

      if (!notify || !myUserId) return;

      const incoming = normalized.filter(
        (msg) => msg.senderId && msg.senderId !== myUserId
      );

      if (incoming.length === 0) return;

      playNotificationSound();

      incoming.forEach((msg) => {
        const title = `New message from ${workerName || "Worker"}`;

        const body = msg.text || "You have a new message";

        const url = `/message/${workerId}/${bookingId}`;

        // native notification fallback (safe)
        if (Notification.permission === "granted") {
          const n = new Notification(title, {
  body,
  icon: "/logo.png",
  tag: `${bookingId}-${msg._id}`,

  data: {
    type: "CHAT_MESSAGE",
    bookingId,
    workerId,
    senderId: msg.senderId,
    url,
  },

  // ✅ THIS CREATES BUTTONS
  actions: [
    {
      action: "open",
      title: "Open",
    },
  ],
} as any);

          n.onclick = () => {
            window.focus();
            window.location.href = url;
          };
        }
      });
    };

    // =========================
    // CONNECT
    // =========================

    socket.on("connect", () => {
      setConnected(true);

      socket.emit("booking.chat.join", {
        bookingId,
      });
    });

    // =========================
    // DISCONNECT
    // =========================

    socket.on("disconnect", () => {
      setConnected(false);
    });

    // =========================
    // CHAT MESSAGE
    // =========================

    socket.on("booking.chat.message", (payload) => {
      addMessages(payload, true);
    });

    // =========================
    // CHAT HISTORY
    // =========================

    socket.on("booking.chat.history", (payload) => {
      addMessages(payload, false);
    });

    // =========================
    // ERROR
    // =========================

    socket.on("connect_error", (err) => {
      console.log("❌ Socket error:", err.message);
    });

    // =========================
    // CLEANUP (FIXED)
    // =========================

    return () => {
      socket.emit("booking.chat.leave", {
        bookingId,
      });

      socket.off("connect");
      socket.off("disconnect");
      socket.off("booking.chat.message");
      socket.off("booking.chat.history");

      socket.removeAllListeners();
      socket.disconnect();

      socketRef.current = null;
      setConnected(false);
    };
  }, [token, bookingId, workerId, myUserId, workerName]);

  // =========================
  // SEND MESSAGE
  // =========================

  const sendMessage = useCallback(
    (text: string) => {
      if (!socketRef.current || !text.trim()) return;

      const optimisticMessage: Message = {
        _id: `temp-${crypto.randomUUID()}`,
        text,
        senderId: myUserId || "",
        createdAt: new Date().toISOString(),
        self: true,
        status: "sent",
      };

      setMessages((prev) =>
        mergeMessages(prev, [optimisticMessage])
      );

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
    setMessages,
  };
}