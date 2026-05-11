"use client";

import { useEffect, useRef } from "react";
import { Check, CheckCheck } from "lucide-react";

import { formatDateLabel } from "../utils/formatdateLabel";
import { formatTime } from "../utils/formattime";

import type { Message } from "../../domain/entities/messages";

import { TypingIndicator } from "../utils/typeindicator";
import MiniAvatar from "../utils/miniavatar";

import type { Worker } from "@/features/Bookings/domain/entities/worker.types";
import CommonCard from "@/components/common/CommonCards";
export default function MessageList({
  messages,
  worker,
  isTyping,
  // myUserId,
}: {
  messages: Message[];
  worker: Worker;
  isTyping: boolean;
  myUserId?: string;
}) {
  const bottomRef =
    useRef<HTMLDivElement>(null);

  // =========================
  // AUTO SCROLL
  // =========================

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  // =========================
  // GROUP MESSAGES BY DATE
  // =========================

  const grouped: {
    label: string;
    messages: Message[];
  }[] = [];

  for (const msg of messages) {
    const safeDate = msg.timestamp
      ? new Date(msg.timestamp)
      : new Date();

    const label =
      formatDateLabel(safeDate);

    if (
      !grouped.length ||
      grouped[grouped.length - 1]
        .label !== label
    ) {
      grouped.push({
        label,
        messages: [msg],
      });
    } else {
      grouped[
        grouped.length - 1
      ].messages.push(msg);
    }
  }
 if (!messages || messages.length === 0) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#f7f4ed] px-4">
      
      <CommonCard className="w-full max-w-md text-center">
        
        <div className="mb-3 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-lg">
            💬
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-800">
          Start the conversation
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          You haven’t chatted with{" "}
          <span className="font-medium text-gray-700">
            {worker.fullName}
          </span>{" "}
          yet. Send a message to begin.
        </p>

        <div className="mt-4 rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-500">
          Based on your current booking
        </div>

      </CommonCard>

      {/* keeps scroll anchor safe */}
      <div ref={bottomRef} />
    </div>
  );
}

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#f7f4ed] px-3 py-4 sm:px-5">
      <div className="flex-1" />

      <div className="mx-auto w-full max-w-4xl">
        {grouped.map((group) => (
          <div key={group.label}>
            {/* DATE LABEL */}

            <div className="mx-auto mb-4 w-fit rounded-full border border-white/80 bg-white/80 px-3 py-1 text-center text-xs font-medium text-gray-500 shadow-sm backdrop-blur">
              {group.label}
            </div>

            {/* MESSAGES */}

            {group.messages.map(
              (msg, i) => {
                // =========================
                // CURRENT USER MESSAGE
                // =========================

              const isMe = msg.self === true;
                // =========================
                // GROUPING
                // =========================

                const prev =
                  group.messages[i - 1];

                const next =
                  group.messages[i + 1];

                const isContinuation =
                  prev?.senderId ===
                  msg.senderId;

                const isLastInGroup =
                  next?.senderId !==
                  msg.senderId;

                // =========================
                // TIME
                // =========================

                const safeTime =
                  msg.timestamp
                    ? new Date(
                        msg.timestamp
                      )
                    : new Date();

                // =========================
                // BUBBLE STYLES
                // =========================

                const baseBubble =
                  "px-3.5 py-2.5 text-sm leading-relaxed break-words transition-all";

                const bubbleShape =
                  "rounded-2xl";

                const meBubble =
                  "bg-blue-600 text-white shadow-sm shadow-blue-600/20";

                const otherBubble =
                  "border border-gray-200 bg-white text-gray-800 shadow-sm";

                // =========================
                // DYNAMIC RADIUS
                // =========================

                const meRadius =
                  isContinuation
                    ? isLastInGroup
                      ? "rounded-[18px_18px_4px_18px]"
                      : "rounded-[18px_4px_4px_18px]"
                    : "rounded-[18px_18px_4px_18px]";

                const otherRadius =
                  isContinuation
                    ? isLastInGroup
                      ? "rounded-[18px_18px_18px_4px]"
                      : "rounded-[4px_18px_18px_4px]"
                    : "rounded-[18px_18px_18px_4px]";

                const bubbleClass = [
                  baseBubble,
                  bubbleShape,

                  isMe
                    ? meBubble
                    : otherBubble,

                  isMe
                    ? meRadius
                    : otherRadius,
                ].join(" ");

                return (
                  <div
                    key={
                      msg._id ||
                      msg.id ||
                      `${msg.text}-${i}`
                    }
                    className={`flex items-end gap-2 ${
                      isMe
                        ? "justify-end"
                        : "justify-start"
                    } ${
                      isContinuation
                        ? "mb-1"
                        : "mb-3"
                    }`}
                  >
                    {/* AVATAR */}

                    {!isMe && (
                      <div
                        className={
                          isLastInGroup
                            ? "visible"
                            : "invisible"
                        }
                      >
                        <MiniAvatar
                          worker={
                            worker
                          }
                        />
                      </div>
                    )}

                    {/* MESSAGE */}

                    <div
                      className={`flex max-w-[82%] flex-col sm:max-w-[70%] ${
                        isMe
                          ? "items-end"
                          : "items-start"
                      }`}
                    >
                      {/* TEXT */}

                      <div
                        className={
                          bubbleClass
                        }
                      >
                        {msg.text}
                      </div>

                      {/* TIME + STATUS */}

                      <div className="mt-1 flex items-center gap-1 px-1 text-[11px] text-gray-400">
                        <span>
                          {formatTime(
                            safeTime
                          )}
                        </span>

                        {/* STATUS */}

                      {isMe && (
                          <span
                            className={`flex items-center ${
                              msg.status === "read"
                                ? "text-blue-500"
                                : "text-gray-400"
                            }`}
                          >
                            {msg.status === "sent" && (
                              <Check size={12} />
                            )}

                            {msg.status === "delivered" && (
                              <CheckCheck size={12} />
                            )}

                            {msg.status === "read" && (
                              <CheckCheck size={12} />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        ))}

        {/* TYPING */}

        {isTyping && (
          <TypingIndicator
            worker={worker}
          />
        )}

        {/* SCROLL TARGET */}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}