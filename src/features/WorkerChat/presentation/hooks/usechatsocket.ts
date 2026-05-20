"use client";

import { useCallback, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

import type { Message } from "../../domain/entities/messages";
import { apiUrl } from "@/features/api/apiConfig";

import { unpackMessages } from "../utils/unpackmessages";
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
  myUserId?: string,
  workerName?: string
) {
  const socketRef = useRef<Socket | null>(null);
  const notifiedIds = useRef<Set<string>>(new Set());
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token || !bookingId) return;

    // console.log("INIT CHAT SOCKET", {
    //   token,
    //   bookingId,
    //   myUserId,
    // });

    notifiedIds.current = new Set();

    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    const getNormalizedMessages = (payload: any) =>
      unpackMessages(payload)
        .map((msg) => normalizeMessage(msg, myUserId))
        .filter((msg) => msg.text?.trim() || msg.senderType || msg.self);

    const handleMessages = (payload: any, notify = false) => {
      const normalized = getNormalizedMessages(payload);

      if (!normalized.length) return;

      queryClient.setQueryData(
        [CHAT_MESSAGES_KEY, bookingId],
        (old: ChatCache | undefined) => {
          const oldMessages = old?.data ?? [];
          const map = new Map<string, Message>();

          oldMessages.forEach((message) =>
            map.set(getMessageKey(message), message)
          );
          normalized.forEach((message) =>
            map.set(getMessageKey(message), message)
          );

          return { data: Array.from(map.values()) };
        }
      );

      if (!notify) return;

      normalized
        .filter((message) => !message.self && message.senderId !== myUserId)
        .forEach((message) => {
          const key = getMessageKey(message);

          if (notifiedIds.current.has(key)) return;
          notifiedIds.current.add(key);

          playNotificationSound();
        });
    };

    socket.on("connect", () => {
      // console.log("CONNECTED:", socket.id);
      socket.emit("booking.chat.join", { bookingId });
    });

    socket.on("booking.chat.message", (payload) => {
      // console.log("LIVE MESSAGE:", payload);

      handleMessages(payload, true);
    });

    socket.on("booking.chat.history", (payload) => {
      // console.log("HISTORY:", payload);
      handleMessages(payload, false);
    });

    return () => {
      // console.log("SOCKET CLEANUP");

      socket.emit("booking.chat.leave", { bookingId });
      socket.disconnect();

      notifiedIds.current.clear();
    };
  }, [token, bookingId, myUserId, workerName, queryClient]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!socketRef.current || !text.trim()) return;

      const tempMessage: Message = {
        _id: `temp-${crypto.randomUUID()}`,
        text,
        senderId: myUserId || "",
        createdAt: new Date().toISOString(),
        self: true,
        status: "sent",
      };

      queryClient.setQueryData(
        [CHAT_MESSAGES_KEY, bookingId],
        (old: ChatCache | undefined) => {
          const oldMessages = Array.isArray(old?.data) ? old.data : [];
          return { data: [...oldMessages, tempMessage] };
        }
      );

      socketRef.current.emit("booking.chat.send", {
        bookingId,
        text,
      });
    },
    [bookingId, myUserId, queryClient]
  );

  return { sendMessage };
}
