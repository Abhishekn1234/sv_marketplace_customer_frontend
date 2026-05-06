"use client";

import { useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import type { Message } from "../../domain/entities/messages";
import type { Worker } from "@/features/Bookings/domain/entities/worker.types";
const SEED_MESSAGES: Message[] = [
  {
    id: 1,
    text: "Hi! I'm on my way. Is the main water valve accessible?",
    sender: "worker",
    timestamp: new Date(Date.now() - 10 * 60000),
  },
  {
    id: 2,
    text: "Yes it's in the utility room next to the boiler.",
    sender: "customer",
    timestamp: new Date(Date.now() - 9 * 60000),
    status: "read",
  },
  {
    id: 3,
    text: "Perfect, thanks. Should be there in about 10 mins.",
    sender: "worker",
    timestamp: new Date(Date.now() - 8 * 60000),
  },
  {
    id: 4,
    text: "Hi, are you coming?",
    sender: "customer",
    timestamp: new Date(Date.now() - 3 * 60000),
    status: "read",
  },
  {
    id: 5,
    text: "Yes, 10 mins",
    sender: "worker",
    timestamp: new Date(Date.now() - 2 * 60000),
  },
];

export default function WorkerChatPageContent({
  worker,
}: {
  workerId: string;
  worker: Worker;
}) {
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg: Message = {
      id: Date.now(),
      text: input.trim(),
      sender: "customer",
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // delivered
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === newMsg.id ? { ...m, status: "delivered" as const } : m
        )
      );
    }, 800);

    // typing indicator
    setTimeout(() => setIsTyping(true), 1500);

    // reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev.map((m) =>
          m.id === newMsg.id ? { ...m, status: "read" as const } : m
        ),
        {
          id: Date.now() + 1,
          text: "Got it! I'll be there shortly.",
          sender: "worker",
          timestamp: new Date(),
        },
      ]);

      setIsTyping(false);
    }, 3500);
  };

  return (
    <div className="flex flex-col h-screen  overflow-hidden">
      
      {/* Optional global animation */}
      <style>{`
        @keyframes bounce {
          0%,80%,100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
      `}</style>

      {/* Header */}
      <ChatHeader worker={worker} />

      {/* Messages (scroll area) */}
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          worker={worker}
          isTyping={isTyping}
        />
      </div>

      {/* Input */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
      />
    </div>
  );
}