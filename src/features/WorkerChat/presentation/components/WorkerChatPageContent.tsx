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

// 👇 SOCKET (you already created this)
import { useChatSocket } from "../hooks/usechatsocket";

import { useNavigate } from "react-router-dom";

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
  const [page, setPage] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const LIMIT = 30;

  // =========================
  // SOCKET (REALTIME)
  // =========================
  useChatSocket(token, bookingId, currentUserId, worker.fullName, (url) => {
    navigate(url);
  });

  // =========================
  // API (INITIAL LOAD ONLY)
  // =========================
  const { data, isLoading, isFetching } = useGetChatMessages(
    bookingId,
    page,
    LIMIT
  );

  const { mutate: sendMessage, isPending } = useSendChatMessage();

  // =========================
  // PAGINATION (KEEP ONLY LOAD MORE)
  // =========================
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el || isFetching) return;

    const hasMore = (data?.data?.length ?? 0) >= page * LIMIT;

    if (el.scrollTop < 100 && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, data, page]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll);

    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // =========================
  // NORMALIZE MESSAGES
  // =========================
  const messages: Message[] = useMemo(() => {
    const rawMessages = Array.isArray(data?.data) ? data.data : [];

    const normalized = rawMessages.map((msg: any): Message => {
      const senderId =
        typeof msg.senderId === "string"
          ? msg.senderId
          : msg.senderId?._id || "";

      return {
        _id: msg._id || crypto.randomUUID(),
        text: msg.message || msg.text || "",
        senderId,
        self: senderId === currentUserId,
        status: msg.status || "delivered",
        timestamp:
          msg.timestamp ||
          msg.createdAt ||
          new Date().toISOString(),
      };
    });

    const unique = Array.from(
      new Map(normalized.map((m) => [m._id, m])).values()
    );

    return unique.sort(
      (a, b) =>
        new Date(a.timestamp || 0).getTime() -
        new Date(b.timestamp || 0).getTime()
    );
  }, [data, currentUserId]);

  // =========================
  // SEND MESSAGE
  // =========================
  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isPending) return;

    sendMessage({
      bookingId,
      message: trimmed,
    });

    // ❌ NO refetch (socket already updates UI)
    setInput("");
  };

  // =========================
  // LOADING
  // =========================
  if (isLoading && page === 1) {
    return (
      <div className="flex h-full items-center justify-center">
        <CommonSpinner />
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <main className="h-full min-h-0  px-0 sm:px-4 sm:py-4 lg:px-6">
      <div className="mx-auto flex h-full max-w-5xl flex-col overflow-hidden  shadow-none sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-xl">

        <ChatHeader worker={worker} bookingId={bookingId} />

        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto bg-[#f7f4ed]"
        >
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