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
  console.log("PAGE PARAM:", pageParam);

  return await usecase.execute({
    bookingId,
    page: pageParam,
    limit,
  });
},

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      const messages = lastPage?.data ?? [];
      // console.log(messages);
      // No more pages
      if (messages.length < limit) {
        return undefined;
      }

      return allPages.length + 1;
    },

    enabled: !!bookingId,
  });
}