"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

import type { Message } from "../../domain/entities/messages";
import { apiUrl } from "@/features/api/apiConfig";

import { normalizeMessage } from "../utils/normalizemessages";
import { playNotificationSound } from "@/components/firebase/sound";
import { getMessageKey } from "../utils/getMessageKey";
import { CHAT_MESSAGES_KEY } from "./useGetChatMessages";

const SOCKET_URL = `${apiUrl}/chat`;

type ChatCache = {
  data: Message[];
};

export function useChatSocket(
  token: string,
  bookingId: string,
  myUserId?: string
) {
  const socketRef = useRef<Socket | null>(null);
  const notifiedIds = useRef(new Set<string>());

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token || !bookingId) return;

    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      forceNew: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected:", socket.id);

      socket.emit("booking.chat.join", {
        bookingId,
      });
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket Error:", error);
    });

   socket.on("booking.chat-message", (payload) => {
  console.log("booking.chat-message", payload);

  const rawMessage =
    payload?.chatMessage ??
    payload?.payload?.chatMessage;

  if (!rawMessage) {
    console.error(
      "chatMessage not found",
      payload
    );
    return;
  }

  const message = normalizeMessage(
    rawMessage,
    myUserId
  );

  console.log("normalized message", message);

  queryClient.setQueryData(
    [CHAT_MESSAGES_KEY, bookingId],
    (old: ChatCache | undefined) => {
      const currentMessages =
        old?.data ?? [];

      const exists =
        currentMessages.some(
          (msg) =>
            getMessageKey(msg) ===
            getMessageKey(message)
        );

      if (exists) {
        return old;
      }

      return {
        data: [
          ...currentMessages,
          message,
        ].sort(
          (a, b) =>
            new Date(
              a.createdAt || 0
            ).getTime() -
            new Date(
              b.createdAt || 0
            ).getTime()
        ),
      };
    }
  );

  if (
    !message.self &&
    message.senderId !== myUserId
  ) {
    const key =
      getMessageKey(message);

    if (
      !notifiedIds.current.has(key)
    ) {
      notifiedIds.current.add(key);

      playNotificationSound();
    }
  }
});
    return () => {
      socket.emit("booking.chat.leave", {
        bookingId,
      });

      socket.off("booking.chat-message");

      socket.removeAllListeners();

      socket.disconnect();

      socketRef.current = null;

      notifiedIds.current.clear();
    };
  }, [
    token,
    bookingId,
    myUserId,
    queryClient,
  ]);

  return {
    socket: socketRef.current,
  };
}