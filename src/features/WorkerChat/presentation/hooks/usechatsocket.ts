import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { Message } from "../../domain/entities/messages";
import { showBrowserNotification } from "@/components/firebase/showBrowserNotification";
import { playNotificationSound } from "@/components/firebase/sound";

const SOCKET_URL = "http://192.168.29.138:4000/chat";

const getId = (value: any) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") return value._id || value.id || "";
  return String(value);
};

const unpackMessages = (payload: any): any[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.messages)) return payload.messages;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.messages)) return payload.data.messages;
  return [payload];
};

const normalizeMessage = (msg: any, myUserId?: string): Message => ({
  ...msg,
  _id: msg._id || msg.id || `${Date.now()}-${Math.random()}`,
  senderId: getId(msg.senderId || msg.sender || msg.userId),
  text: msg.text || msg.message || msg.body || "",
  timestamp: msg.timestamp || msg.createdAt || new Date().toISOString(),
  self: getId(msg.senderId || msg.sender || msg.userId) === myUserId,
  status: msg.status || "sent",
});

const mergeMessages = (prev: Message[], incoming: Message[]) => {
  const filtered = prev.filter((oldMessage) => {
    return !incoming.some((newMessage) => {
      const sameOptimisticMessage =
        oldMessage._id?.startsWith("temp-") &&
        oldMessage.text === newMessage.text &&
        oldMessage.senderId === newMessage.senderId;

      return sameOptimisticMessage;
    });
  });

  const byId = new Map<string, Message>();

  [...filtered, ...incoming].forEach((message) => {
    const id = message._id || message.id || `${message.senderId}-${message.timestamp}-${message.text}`;
    byId.set(String(id), message);
  });

  return Array.from(byId.values()).sort(
    (a, b) =>
      new Date(a.timestamp || 0).getTime() -
      new Date(b.timestamp || 0).getTime()
  );
};

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

  useEffect(() => {
    setMessages(initialMessage ? [initialMessage] : []);
  }, [bookingId]);

  useEffect(() => {
    if (!initialMessage) return;

    setMessages((prev) => mergeMessages(prev, [initialMessage]));
  }, [initialMessage]);

  useEffect(() => {
    if (!token || !bookingId) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    const addMessages = (payload: any, notify = false) => {
      const normalized = unpackMessages(payload)
        .map((msg) => normalizeMessage(msg, myUserId))
        .filter((msg) => msg.text.trim().length > 0);

      if (!normalized.length) return;

      setMessages((prev) => mergeMessages(prev, normalized));

      if (!notify) return;

      normalized.forEach((msg) => {
        if (msg.senderId === myUserId) return;

        playNotificationSound();
        showBrowserNotification({
          notification: {
            title: `New message from ${workerName || "Worker"}`,
            body: msg.text || "You have a new chat message",
          },
          data: {
            url: `/message/${workerId}/${bookingId}`,
            id: `chat-${bookingId}-${msg._id || msg.id}`,
            messageId: msg._id || msg.id,
            text: msg.text,
            timestamp: msg.timestamp,
            bookingId,
            workerId,
            senderId: msg.senderId,
          },
        });
      });
    };

    socket.on("connect", () => {
      setConnected(true);

      socket.emit("booking.chat.join", { bookingId }, (payload: any) => {
        addMessages(payload, false);
      });

      socket.emit("booking.chat.history", { bookingId }, (payload: any) => {
        addMessages(payload, false);
      });
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("booking.chat.message", (payload: any) => {
      addMessages(payload, true);
    });

    socket.on("booking.chat.history", (payload: any) => {
      addMessages(payload, false);
    });

    socket.on("booking.chat.messages", (payload: any) => {
      addMessages(payload, false);
    });

    socket.on("booking.chat.joined", (payload: any) => {
      addMessages(payload, false);
    });

    socket.on("connect_error", (err) => {
      console.log("Socket error:", err.message);
    });

    return () => {
      socket.emit("booking.chat.leave", { bookingId });
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [token, bookingId, workerId, myUserId, workerName]);

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

      setMessages((prev) => mergeMessages(prev, [optimisticMessage]));

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
