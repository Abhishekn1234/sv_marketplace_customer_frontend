"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

import type { Worker } from "@/features/Bookings/domain/entities/worker.types";
import type { Message } from "../../domain/entities/messages";

import { useChatSocket } from "../hooks/usechatsocket";
import { useGetChatMessages } from "../hooks/useGetChatMessages";
import { useSendChatMessage } from "../hooks/useSendChatMessage";

import CommonSpinner from "@/components/common/CommonLoadingSpinner";

const LIMIT = 30;

const getId = (value: any) => {
  if (!value) return "";

  if (typeof value === "string") return value;

  if (typeof value === "object") {
    return value._id || value.id || "";
  }

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

  const [page, setPage] = useState(1);

  const [allApiMessages, setAllApiMessages] =
    useState<any[]>([]);

  const containerRef =
    useRef<HTMLDivElement>(null);

  // ================= API =================

  const {
    data,
    isLoading,
    isFetching,
  } = useGetChatMessages(
    bookingId,
    page,
    LIMIT
  );

  const { mutate: sendChatMessage } =
    useSendChatMessage();

  // ================= SOCKET =================

  const {
    messages: socketMessages,
    sendMessage,
  } = useChatSocket(
    token,
    bookingId,
    worker._id,
    currentUserId,
    worker.fullName
  );

  // ================= APPEND PAGINATED MESSAGES =================

  useEffect(() => {
    if (!data?.data) return;

    setAllApiMessages((prev) => {
      const merged = [
        ...data.data,
        ...prev,
      ];

      const unique = merged.filter(
        (msg, index, self) =>
          index ===
          self.findIndex(
            (m) => m.id === msg.id
          )
      );

      return unique;
    });
  }, [data]);

  // ================= LOAD MORE ON TOP SCROLL =================

  useEffect(() => {
    const container =
      containerRef.current;

    if (!container) return;

    const handleScroll = () => {
      if (
        container.scrollTop < 100 &&
        !isFetching &&
       (data?.data?.length ?? 0) >= LIMIT
      ) {
        setPage((prev) => prev + 1);
      }
    };

    container.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      container.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [isFetching, data]);

  // ================= MERGE =================

  const allMessages = useMemo(() => {
    const apiMessages =
      allApiMessages.map((msg) => {
        const isMe =
          getId(msg.senderId) ===
          currentUserId;

        return {
          _id: msg.id,

          id: msg.id,

          text: msg.message || "",

          senderId: getId(
            msg.senderId
          ),

          sender: isMe
            ? "customer"
            : "worker",

          self: isMe,

          timestamp:
            msg.createdAt ||
            new Date().toISOString(),

          status:
            msg.status ||
            "delivered",
        };
      });

    const merged = [
      ...apiMessages,
      ...socketMessages,
    ];

    const unique = merged.filter(
      (msg, index, self) =>
        index ===
        self.findIndex((m) => {
          const sameId =
            String(
              m._id || m.id
            ) ===
            String(
              msg._id || msg.id
            );

          const sameContent =
            m.text?.trim() ===
              msg.text?.trim() &&
            getId(m.senderId) ===
              getId(msg.senderId) &&
            Math.abs(
              new Date(
                m.timestamp || 0
              ).getTime() -
                new Date(
                  msg.timestamp || 0
                ).getTime()
            ) < 15000;

          return (
            sameId || sameContent
          );
        })
    );

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
  }, [
    allApiMessages,
    socketMessages,
    currentUserId,
  ]);

  // ================= UI FORMAT =================

  const mappedMessages: Message[] =
    allMessages.map((msg) => {
      const senderId = getId(
        msg.senderId
      );

      const isMe =
        senderId === currentUserId;

      return {
        id: msg._id,

        _id: msg._id,

        text: msg.text || "",

        sender: isMe
          ? "customer"
          : "worker",

        senderId,

        self: isMe,

        timestamp:
          typeof msg.timestamp ===
          "string"
            ? msg.timestamp
            : new Date(
                msg.timestamp
              ).toISOString(),

        status:
          msg.status ||
          "delivered",
      };
    });

  // ================= SEND =================

  const handleSend = () => {
    if (!input.trim()) return;

    const messageText =
      input.trim();

    sendMessage(messageText);

    sendChatMessage({
      bookingId,
      message: messageText,
    });

    setInput("");
  };

  // ================= INITIAL LOADING =================

  if (isLoading && page === 1) {
    return (
      <div className="flex h-full items-center justify-center">
        <CommonSpinner />
      </div>
    );
  }

  return (
    <main className="h-full min-h-0 bg-[#F1EFE8] px-0 sm:px-4 sm:py-4 lg:px-6">
      <div className="mx-auto flex h-full max-w-5xl flex-col overflow-hidden bg-white shadow-none sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-xl">

        {/* HEADER */}

        <ChatHeader worker={worker}  bookingId={bookingId}/>

        {/* MESSAGES */}

        <div
          ref={containerRef}
          className="min-h-0 flex-1 overflow-y-auto bg-[#f7f4ed]"
        >
          {/* TOP LOADER */}

          {isFetching &&
            page > 1 && (
              <div className="py-4">
                <CommonSpinner />
              </div>
            )}

          <MessageList
            messages={
              mappedMessages
            }
            worker={worker}
            isTyping={false}
            myUserId={
              currentUserId
            }
          />
        </div>

        {/* INPUT */}

        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
        />
      </div>
    </main>
  );
}