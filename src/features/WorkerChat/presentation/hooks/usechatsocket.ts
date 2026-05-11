import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

import type { Message } from "../../domain/entities/messages";

import { showBrowserNotification } from "@/components/firebase/showBrowserNotification";
import { playNotificationSound } from "@/components/firebase/sound";

import { apiUrl } from "@/features/api/apiConfig";
import { mergeMessages } from "../utils/mergemessages";
import { unpackMessages } from "../utils/unpackmessages";
import { normalizeMessage } from "../utils/normalizemessages";

const SOCKET_URL = `${apiUrl}/chat`;
export function useChatSocket(
  token: string,
  bookingId: string,
  workerId?: string,
  myUserId?: string,
  workerName?: string,
  initialMessage?: Message | null
) {
  const socketRef =
    useRef<Socket | null>(null);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [connected, setConnected] =
    useState(false);

  // =========================
  // INITIAL MESSAGE
  // =========================

  useEffect(() => {
    if (initialMessage) {
      setMessages([initialMessage]);
    } else {
      setMessages([]);
    }
  }, [bookingId]);

  useEffect(() => {
    if (!initialMessage) return;

    setMessages((prev) =>
      mergeMessages(prev, [
        initialMessage,
      ])
    );
  }, [initialMessage]);

  // =========================
  // SOCKET CONNECTION
  // =========================

  useEffect(() => {
    if (!token || !bookingId) return;

    const socket = io(SOCKET_URL, {
      auth: {
        token,
      },

      transports: ["websocket"],
    });

    socketRef.current = socket;

    const addMessages = (
      payload: any,
      notify = false
    ) => {
      const normalized = unpackMessages(
        payload
      )
        .map((msg) =>
          normalizeMessage(
            msg,
            myUserId
          )
        )
        .filter(
          (msg) =>
            msg.text.trim().length > 0
        );

      if (!normalized.length) return;

      setMessages((prev) =>
        mergeMessages(
          prev,
          normalized
        )
      );

      if (!notify) return;

      normalized.forEach((msg) => {
        // no notification for self
        if (
          msg.senderId === myUserId
        ) {
          return;
        }

        playNotificationSound();

        showBrowserNotification({
          notification: {
            title: `New message from ${
              workerName || "Worker"
            }`,

            body:
              msg.text ||
              "You have a new chat message",
          },

       data: {
  url: `/message/${workerId}/${bookingId}`,
},
        });
      });
    };

    // =========================
    // CONNECT
    // =========================

    socket.on("connect", () => {
      console.log(
        "Connected:",
        socket.id
      );

      setConnected(true);

      socket.emit(
        "booking.chat.join",
        {
          bookingId,
        }
      );
    });

    // =========================
    // DISCONNECT
    // =========================

    socket.on(
      "disconnect",
      () => {
        console.log(
          "Disconnected"
        );

        setConnected(false);
      }
    );

    // =========================
    // SINGLE MESSAGE
    // =========================

    socket.on(
      "booking.chat.message",
      (payload: any) => {
        console.log(
          "Message:",
          payload
        );

        addMessages(
          payload,
          true
        );
      }
    );

    // =========================
    // CHAT HISTORY
    // =========================

    socket.on(
      "booking.chat.history",
      (payload: any) => {
        console.log(
          "History:",
          payload
        );

        addMessages(
          payload,
          false
        );
      }
    );

    // =========================
    // SOCKET ERROR
    // =========================

    socket.on(
      "connect_error",
      (err) => {
        console.log(
          "Socket error:",
          err.message
        );
      }
    );

    // =========================
    // CLEANUP
    // =========================

    return () => {
      socket.emit(
        "booking.chat.leave",
        {
          bookingId,
        }
      );

      socket.disconnect();

      socketRef.current = null;

      setConnected(false);
    };
  }, [
    token,
    bookingId,
    workerId,
    myUserId,
    workerName,
  ]);

  // =========================
  // SEND MESSAGE
  // =========================

  const sendMessage = useCallback(
    (text: string) => {
      if (
        !socketRef.current ||
        !text.trim()
      ) {
        return;
      }

            const optimisticMessage: Message = {
          _id: `temp-${Date.now()}`,
          text,
          senderId: myUserId || "",
          timestamp: new Date().toISOString(),
          self: true,
          status: "delivered",
        };

      // optimistic update
      setMessages((prev) =>
        mergeMessages(prev, [
          optimisticMessage,
        ])
      );

      // socket send
      socketRef.current.emit(
        "booking.chat.send",
        {
          bookingId,
          text,
        }
      );
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