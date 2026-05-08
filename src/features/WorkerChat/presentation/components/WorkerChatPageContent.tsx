"use client";

import { useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import type { Worker } from "@/features/Bookings/domain/entities/worker.types";
import { useChatSocket } from "../hooks/usechatsocket";

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

  const { messages, sendMessage } = useChatSocket(
    token,
    bookingId,
    worker._id,
    currentUserId,
    worker.fullName
  );

  const mappedMessages = messages.map((msg) => ({
    id: msg._id || msg.id,
    text: msg.text,
    sender: msg.senderId === currentUserId ? ("customer" as const) : ("worker" as const),
    senderId: msg.senderId,
    timestamp: msg.timestamp || new Date().toISOString(),
    status: msg.status,
  }));

  const handleSend = () => {
    if (!input.trim()) return;

    sendMessage(input);
    setInput("");
  };

  return (
    <main className="min-h-[100dvh] bg-[#F1EFE8] px-0 sm:px-4 sm:py-4 lg:px-6">
      <div className="mx-auto flex h-[100dvh] max-w-5xl flex-col overflow-hidden bg-white shadow-none sm:h-[calc(100dvh-2rem)] sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-xl">
        <ChatHeader worker={worker} />

        <div className="min-h-0 flex-1 overflow-hidden bg-[#f7f4ed]">
          <MessageList messages={mappedMessages} worker={worker} isTyping={false} />
        </div>

        <ChatInput value={input} onChange={setInput} onSend={handleSend} />
      </div>
    </main>
  );
}
