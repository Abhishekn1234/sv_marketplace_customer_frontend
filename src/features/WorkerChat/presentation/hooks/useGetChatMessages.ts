"use client";

import { useQuery } from "@tanstack/react-query";

import { ChatRepositoryImpl } from "../../data/repositories/ChatRepositoryImpl";
import { GetChatMessagesUsecase } from "../../domain/usecase/GetChatMessageUsecase";

const repository = new ChatRepositoryImpl();
const usecase = new GetChatMessagesUsecase(repository);

export const CHAT_MESSAGES_KEY = "CHAT_MESSAGES_KEY";

export function useGetChatMessages(
  bookingId: string,
  page = 1,
  limit = 30
) {
  return useQuery({
    queryKey: [CHAT_MESSAGES_KEY, bookingId],

    queryFn: async () => {
      const res = await usecase.execute({
        bookingId,
        page,
        limit,
      });

      return res ?? { data: [], page: 1, total: 0 };
    },

    enabled: !!bookingId,

    staleTime: Infinity, // 🔥 IMPORTANT (no auto refetch)
    gcTime: 1000 * 60 * 30,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchInterval: false,
  });
}