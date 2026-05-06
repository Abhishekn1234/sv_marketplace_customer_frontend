"use client";

import { useEffect, useRef } from "react";
import { Check, CheckCheck } from "lucide-react";


import { formatDateLabel } from "../utils/formatdateLabel";
import { formatTime } from "../utils/formattime";

import type { Message } from "../../domain/entities/messages";
import { TypingIndicator } from "../utils/typeindicator";
import MiniAvatar from "../utils/miniavatar";
import type { Worker } from "@/features/Bookings/domain/entities/worker.types";



export default function MessageList({
  messages,
  worker,
  isTyping,
}: {
  messages: Message[];
  worker: Worker;
  isTyping: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Group by date
  const grouped: { label: string; messages: Message[] }[] = [];

  for (const msg of messages) {
    const label = formatDateLabel(msg.timestamp);
    if (!grouped.length || grouped[grouped.length - 1].label !== label) {
      grouped.push({ label, messages: [msg] });
    } else {
      grouped[grouped.length - 1].messages.push(msg);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col">
      {grouped.map((group) => (
        <div key={group.label}>
          {/* Date label */}
          <div className="text-center text-xs text-gray-500 bg-white/70 border border-gray-300 rounded-full px-3 py-1 w-fit mx-auto mb-3">
            {group.label}
          </div>

          {group.messages.map((msg, i) => {
            const isMe = msg.sender === "customer";
            const prev = group.messages[i - 1];
            const next = group.messages[i + 1];

            const isContinuation = prev?.sender === msg.sender;
            const isLastInGroup = next?.sender !== msg.sender;

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  isMe ? "justify-end" : "justify-start"
                } ${isContinuation ? "mb-1" : "mb-3"}`}
              >
                {/* Avatar */}
                {!isMe && (
                  <div
                    className={`${
                      isLastInGroup ? "visible" : "invisible"
                    }`}
                  >
                    <MiniAvatar worker={worker} />
                  </div>
                )}

                {/* Message */}
                <div
                  className={`max-w-[75%] flex flex-col ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`
                      px-3 py-2 text-sm leading-relaxed break-words rounded-2xl
                      ${
                        isMe
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-800 border border-gray-300"
                      }
                      ${
                        isMe
                          ? isContinuation
                            ? "rounded-br-2xl"
                            : "rounded-br-md"
                          : isContinuation
                          ? "rounded-bl-2xl"
                          : "rounded-bl-md"
                      }
                    `}
                  >
                    {msg.text}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-1 mt-1 px-1 text-[11px] text-gray-400">
                    <span>{formatTime(msg.timestamp)}</span>

                    {isMe && msg.status && (
                      <span
                        className={`flex items-center ${
                          msg.status === "read"
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {msg.status === "sent" ? (
                          <Check size={12} />
                        ) : (
                          <CheckCheck size={12} />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {isTyping && <TypingIndicator worker={worker} />}
      <div ref={bottomRef} />
    </div>
  );
}