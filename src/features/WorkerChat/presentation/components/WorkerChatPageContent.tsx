"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";

import { useGetChatMessages } from "../hooks/useGetChatMessages";
import { useSendChatMessage } from "../hooks/useSendChatMessage";

import type { Message } from "../../domain/entities/messages";

import CommonSpinner from "@/components/common/CommonLoadingSpinner";

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
  worker: Worker;
  bookingId: string;
  token: string;
  currentUserId: string;
}) {
  const [input, setInput] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const previousScrollHeightRef = useRef(0);
  const restoringRef = useRef(false);
  const fetchingRef = useRef(false);
  const initialLoadDone = useRef(false);

  const LIMIT = 30;

  useChatSocket(token, bookingId, currentUserId);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetChatMessages(bookingId, LIMIT);

  const { mutate: sendMessage, isPending } =
    useSendChatMessage();

  const handleScroll = useCallback(async () => {
    const el = containerRef.current;

    if (
      !el ||
      !hasNextPage ||
      isFetchingNextPage ||
      restoringRef.current ||
      fetchingRef.current
    ) {
      return;
    }

    if (el.scrollTop <= 20) {
      fetchingRef.current = true;

      previousScrollHeightRef.current =
        el.scrollHeight;

      restoringRef.current = true;

      try {
        await fetchNextPage();
      } finally {
        fetchingRef.current = false;
      }
    }
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  ]);

  const messages: Message[] = useMemo(() => {
    const rawMessages =
      data?.pages.flatMap(
        (page) => page?.data ?? []
      ) ?? [];

    const normalized = rawMessages.map(
      (msg: any): Message => {
        const senderId =
          typeof msg.senderId === "string"
            ? msg.senderId
            : msg.senderId?._id || "";

        return {
          _id:
            msg._id ||
            crypto.randomUUID(),
          text:
            msg.message ||
            msg.text ||
            "",
          senderId,
          self:
            senderId === currentUserId,
          status:
            msg.status || "delivered",
          timestamp:
            msg.timestamp ||
            msg.createdAt ||
            new Date().toISOString(),
        };
      }
    );

    const unique = Array.from(
      new Map(
        normalized.map((m) => [
          m._id,
          m,
        ])
      ).values()
    );

    return unique.sort(
      (a, b) =>
        new Date(
          a.timestamp || 0
        ).getTime() -
        new Date(
          b.timestamp || 0
        ).getTime()
    );
  }, [data, currentUserId]);

  // First load -> scroll to bottom
  useEffect(() => {
    const el = containerRef.current;

    if (
      !el ||
      initialLoadDone.current ||
      !messages.length
    ) {
      return;
    }

    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
      initialLoadDone.current = true;
    });
  }, [messages.length]);

  // Restore position after older messages load
  useEffect(() => {
    const el = containerRef.current;

    if (
      !el ||
      !restoringRef.current ||
      isFetchingNextPage
    ) {
      return;
    }

    requestAnimationFrame(() => {
      const newScrollHeight =
        el.scrollHeight;

      const diff =
        newScrollHeight -
        previousScrollHeightRef.current;

      el.scrollTop = diff;

      restoringRef.current = false;
    });
  }, [messages, isFetchingNextPage]);

  const handleSend = () => {
    const trimmed = input.trim();

    if (!trimmed || isPending) {
      return;
    }

    sendMessage({
      bookingId,
      message: trimmed,
    });

    setInput("");
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <CommonSpinner />
      </div>
    );
  }

  return (
    <main className="h-screen px-0 sm:px-4 sm:py-4 lg:px-6">
      <div className="mx-auto flex h-full max-w-5xl flex-col overflow-hidden shadow-none sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-xl">
        <ChatHeader
          worker={worker}
          bookingId={bookingId}
        />

        <div
          ref={containerRef}
          className="min-h-0 flex-1 overflow-y-auto bg-[#f7f4ed]"
          onScroll={handleScroll}
        >
          {isFetchingNextPage && (
            <div className="py-4">
              <CommonSpinner />
            </div>
          )}

          <MessageList
            messages={messages}
            worker={worker}
            isTyping={false}
            myUserId={currentUserId}
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