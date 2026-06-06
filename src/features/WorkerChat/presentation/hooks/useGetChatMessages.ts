"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { ChatRepositoryImpl } from "../../data/repositories/ChatRepositoryImpl";
import { GetChatMessagesUsecase } from "../../domain/usecase/GetChatMessageUsecase";

const repository = new ChatRepositoryImpl();
const usecase = new GetChatMessagesUsecase(repository);

export const CHAT_MESSAGES_KEY = "CHAT_MESSAGES_KEY";

export function useGetChatMessages(
  bookingId: string,
  limit = 30
) {
  return useInfiniteQuery({
    queryKey: [CHAT_MESSAGES_KEY, bookingId],

    queryFn: async ({ pageParam = 1 }) => {
      const res = await usecase.execute({
        bookingId,
        page: pageParam,
        limit,
      });

      // console.log("📦 API RAW RESPONSE:", res);

      const safeData = Array.isArray(res?.data)
        ? res.data
        : [];

      // console.log("📦 SAFE DATA LENGTH:", safeData.length);

      return {
        ...res,
        data: safeData,
      };
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      const messages = Array.isArray(lastPage?.data)
        ? lastPage.data
        : [];

      // console.log("➡️ lastPage.data:", lastPage?.data);
      // console.log("➡️ messages length:", messages.length);

      if (messages.length < limit) {
        // console.log("🛑 No more pages");
        return undefined;
      }

      // console.log("➡️ Next page:", allPages.length + 1);
      return allPages.length + 1;
    },

    enabled: !!bookingId,
  });
}