import { useEffect, useMemo, useRef, useState } from "react";
import { useGetChatMessages } from "../hooks/useGetChatMessages";
import { useSendChatMessage } from "../hooks/useSendChatMessage";
import type { Message } from "../../domain/entities/messages";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import type { Worker } from "@/features/Bookings/domain/entities/worker.types";

export default function WorkerChatPageContent({
  worker,
  bookingId,
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
  const LIMIT = 30; // messages per page
  // ================= API (ONLY SOURCE OF TRUTH) =================
  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useGetChatMessages(bookingId, page, LIMIT);

  const { mutate: sendMessage } = useSendChatMessage();

  // ================= OPTIONAL: POLLING (realtime replacement) =================
  useEffect(() => {
    const interval = setInterval(() => {
      refetch(); // keeps chat updated without socket
    }, 5000); // adjust: 3–10s depending on load

    return () => clearInterval(interval);
  }, [refetch]);

  // ================= PAGINATION =================
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      if (
        el.scrollTop < 100 &&
        !isFetching &&
        (data?.data?.length ?? 0) >= LIMIT
      ) {
        setPage((p) => p + 1);
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [isFetching, data]);

  // ================= NORMALIZED MESSAGES =================
  const messages: Message[] = useMemo(() => {
    const apiMessages: Message[] = (data?.data || []).map((msg: any) => ({
      _id: msg._id,
      id: msg._id,
      text: msg.message || "",
      senderId: typeof msg.senderId === "string"
        ? msg.senderId
        : msg.senderId?._id || "",

      self:
        (typeof msg.senderId === "string"
          ? msg.senderId
          : msg.senderId?._id) === currentUserId,

      status: msg.status || "delivered",
      timestamp: msg.createdAt,
    }));

    // ONLY API DATA NOW
    return apiMessages.sort(
      (a, b) =>
        new Date(a.timestamp || 0).getTime() -
        new Date(b.timestamp || 0).getTime()
    );
  }, [data, currentUserId]);

  // ================= SEND MESSAGE =================
  const handleSend = () => {
    if (!input.trim()) return;

    sendMessage({
      bookingId,
      message: input.trim(),
    });

    setInput("");

    // optional: instant refresh after send
    setTimeout(() => refetch(), 200);
  };

  // ================= LOADING =================
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
        <ChatHeader worker={worker} bookingId={bookingId} />

        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto bg-[#f7f4ed]"
        >
          {isFetching && page > 1 && <CommonSpinner />}

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