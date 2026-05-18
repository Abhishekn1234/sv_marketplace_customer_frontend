"use client";

import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

import type { Message } from "../../domain/entities/messages";
import { apiUrl } from "@/features/api/apiConfig";

import { unpackMessages } from "../utils/unpackmessages";
import { normalizeMessage } from "../utils/normalizemessages";
import { playNotificationSound } from "@/components/firebase/sound";
import { getMessageKey } from "../utils/getMessageKey";

import { CHAT_MESSAGES_KEY } from "./useGetChatMessages";
// import { navigateTo } from "@/navigationservice";

const SOCKET_URL = `${apiUrl}/chat`;

type ChatCache = {
  data: Message[];
};

export function useChatSocket(
  token: string,
  bookingId: string,
  myUserId?: string,
  workerName?: string,
  onNavigate?: (url: string) => void
) {
  const socketRef = useRef<Socket | null>(null);
  const notifiedIds = useRef<Set<string>>(new Set());
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token || !bookingId) return;

    // reset notification cache per booking
    notifiedIds.current = new Set();

    // cleanup old socket
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    // =========================
    // MESSAGE HANDLER
    // =========================
    const handleMessages = (payload: any, notify = false) => {
      const normalized = unpackMessages(payload)
        .map((msg) => normalizeMessage(msg, myUserId))
        .filter((m) => m.text?.trim() || (m as any).type || (m as any).attachment);

      if (!normalized.length) return;

      // =========================
      // UPDATE CACHE (NO REFETCH)
      // =========================
      queryClient.setQueryData(
        [CHAT_MESSAGES_KEY, bookingId],
        (old: ChatCache | undefined) => {
          const oldMessages = Array.isArray(old?.data) ? old.data : [];

          const map = new Map<string, Message>();

          const add = (m: Message) => {
            const key = getMessageKey(m);
            map.set(key, m);
          };

          oldMessages.forEach(add);
          normalized.forEach(add);

          return {
            data: Array.from(map.values()),
          };
        }
      );

      // =========================
      // NOTIFICATIONS
      // =========================
      if (!notify) return;

      normalized
        .filter((m) => m.senderId && m.senderId !== myUserId)
        .forEach((msg) => {
          const key = getMessageKey(msg);

          if (notifiedIds.current.has(key)) return;

          const set = notifiedIds.current;
          set.add(key);
          
          // prevent memory leak (keep last 200)
          if (set.size > 200) {
            const first = set.values().next().value;
            if(!first) return;
            set.delete(first);
          }

          playNotificationSound();

          if (Notification.permission !== "granted") return;

          const notification = new Notification(
            `New message from ${workerName || "Worker"}`,
            {
              body: msg.text,
              icon: "/logo.png",
              tag: key,
            }
          );

            notification.onclick = () => {
  window.focus();
  window.location.href = `/message/${bookingId}`;
};
        });
    };

    // =========================
    // SOCKET EVENTS
    // =========================
    socket.on("connect", () => {
      socket.emit("booking.chat.join", { bookingId });
    });

    socket.on("booking.chat.message", (payload) => {
      handleMessages(payload, true);
    });

    socket.on("booking.chat.history", (payload) => {
      handleMessages(payload, false);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    // =========================
    // CLEANUP
    // =========================
    return () => {
      socket.emit("booking.chat.leave", { bookingId });
      socket.removeAllListeners();
      socket.disconnect();

      socketRef.current = null;
      notifiedIds.current.clear();
    };
  }, [token, bookingId, myUserId, workerName, queryClient, onNavigate]);

  // =========================
  // SEND MESSAGE
  // =========================
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

          return {
            data: [...oldMessages, tempMessage],
          };
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