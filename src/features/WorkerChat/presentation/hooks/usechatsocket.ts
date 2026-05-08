import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

import type { Message } from "../../domain/entities/messages";

import { showBrowserNotification } from "@/components/firebase/showBrowserNotification";
import { playNotificationSound } from "@/components/firebase/sound";

import { apiUrl } from "@/features/api/apiConfig";

const SOCKET_URL = `${apiUrl}/chat`;

const getId = (value: any) => {
  if (!value) return "";

  if (typeof value === "string") return value;

  if (typeof value === "object") {
    return value._id || value.id || "";
  }

  return String(value);
};

const unpackMessages = (payload: any): any[] => {
  if (!payload) return [];

  if (Array.isArray(payload)) return payload;

  if (Array.isArray(payload.messages)) {
    return payload.messages;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload.data?.messages)) {
    return payload.data.messages;
  }

  return [payload];
};

const normalizeMessage = (
  msg: any,
  myUserId?: string
): Message => ({
  ...msg,

  _id:
    msg._id ||
    msg.id ||
    `temp-${Date.now()}-${Math.random()}`,

  senderId: getId(
    msg.senderId ||
      msg.sender ||
      msg.userId
  ),

  text:
    msg.text ||
    msg.message ||
    msg.body ||
    "",

  timestamp:
    msg.timestamp ||
    msg.createdAt ||
    new Date().toISOString(),

  self:
    getId(
      msg.senderId ||
        msg.sender ||
        msg.userId
    ) === myUserId,

  status: msg.status || "sent",
});

const mergeMessages = (
  prev: Message[],
  incoming: Message[]
) => {
  const merged = [...prev];

  incoming.forEach((newMessage) => {
    const exists = merged.some((oldMessage) => {
      // same real database id
      if (
        newMessage._id &&
        !String(newMessage._id).startsWith(
          "temp-"
        ) &&
        oldMessage._id === newMessage._id
      ) {
        return true;
      }

      // optimistic duplicate check
      return (
        oldMessage.text === newMessage.text &&
        oldMessage.senderId ===
          newMessage.senderId &&
        Math.abs(
          new Date(
            oldMessage.timestamp || 0
          ).getTime() -
            new Date(
              newMessage.timestamp || 0
            ).getTime()
        ) < 5000
      );
    });

    if (!exists) {
      merged.push(newMessage);
    }
  });

  return merged.sort(
    (a, b) =>
      new Date(
        a.timestamp || 0
      ).getTime() -
      new Date(
        b.timestamp || 0
      ).getTime()
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

      const optimisticMessage: Message =
        {
          _id: `temp-${Date.now()}`,

          text,

          senderId:
            myUserId || "",

          timestamp:
            new Date().toISOString(),

          self: true,

          status: "sent",
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