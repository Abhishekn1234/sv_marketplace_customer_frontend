"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

import type { Worker } from "@/features/Bookings/domain/entities/worker.types";
import type { Message } from "../../domain/entities/messages";

import { useChatSocket } from "../hooks/usechatsocket";
import { useGetChatMessages } from "../hooks/useGetChatMessages";
import { useSendChatMessage } from "../hooks/useSendChatMessage";
const getId = (value: any) => {
  if (!value) return "";

  if (typeof value === "string") return value;

  if (typeof value === "object")
    return value._id || value.id || "";

  return String(value);
};

export default function WorkerChatPageContent({
  worker,
  bookingId,
  token,
  currentUserId,
}: {
  workerId: string;
  worker: Worker;
  bookingId: string;
  token: string;
  currentUserId: string;
}) {
  const [input, setInput] = useState("");

  const [searchParams] = useSearchParams();

  
  const { data } = useGetChatMessages(
    bookingId,
    1,
    50
  );
  const { mutate: sendChatMessage} =
  useSendChatMessage();

  
  const notificationMessage =
    useMemo<Message | null>(() => {
      const text = searchParams.get("text");

      if (!text) return null;

      return {
        _id:
          searchParams.get("messageId") ||
          `notification-${bookingId}-${searchParams.get("timestamp") || Date.now()}`,

        text,

        senderId:
          searchParams.get("senderId") ||
          worker._id,

        timestamp:
          searchParams.get("timestamp") ||
          new Date().toISOString(),

        status: "sent",
      };
    }, [bookingId, searchParams, worker._id]);

  // ================= SOCKET =================
  const {
    messages: socketMessages,
    sendMessage,
  } = useChatSocket(
    token,
    bookingId,
    worker._id,
    currentUserId,
    worker.fullName,
    notificationMessage
  );

  // ================= MERGE API + SOCKET =================
const allMessages = useMemo(() => {
  const apiMessages = (data?.messages || []).map((msg) => ({
    _id: msg._id,
    text: msg.message,
    senderId: msg.senderId,
    timestamp: msg.createdAt,
    status: "sent",
  }));

  const merged = [
    ...apiMessages,
    ...socketMessages,
  ];

  // remove duplicates
  const unique = merged.filter(
    (msg, index, self) =>
      index ===
      self.findIndex(
        (m) => m._id === msg._id
      )
  );

  // sort by date
  unique.sort(
    (a, b) =>
      new Date(
        a.timestamp || 0
      ).getTime() -
      new Date(
        b.timestamp || 0
      ).getTime()
  );

  return unique;
}, [data?.messages, socketMessages]);

  // ================= UI FORMAT =================
 const mappedMessages: Message[] = allMessages.map((msg) => {
  const status: "sent" | "delivered" | "read" | undefined =
    msg.status === "sent" ||
    msg.status === "delivered" ||
    msg.status === "read"
      ? msg.status
      : undefined;

  return {
    id: msg._id,

    text: msg.text || "",

    sender:
      getId(msg.senderId) === currentUserId
        ? "customer"
        : "worker",

    senderId: getId(msg.senderId),

    timestamp:
      typeof msg.timestamp === "string"
        ? msg.timestamp
        : new Date(msg.timestamp).toISOString(),

    status,
  };
});

  // ================= SEND =================
 const handleSend = () => {
  if (!input.trim()) return;

  const messageText = input;

  // optimistic socket update
  sendMessage(messageText);

  // API persist
  sendChatMessage({
    bookingId,
    message: messageText,
  });

  setInput("");
};

  return (
    <main className="h-full min-h-0 bg-[#F1EFE8] px-0 sm:px-4 sm:py-4 lg:px-6">
      <div className="mx-auto flex h-full max-w-5xl flex-col overflow-hidden bg-white shadow-none sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-xl">
        
        <ChatHeader worker={worker} />

        <div className="min-h-0 flex-1 overflow-hidden bg-[#f7f4ed]">
          <MessageList
            messages={mappedMessages}
            worker={worker}
            isTyping={false}
          />
        </div>

        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
        />
      </div>
    </main>
  );
}