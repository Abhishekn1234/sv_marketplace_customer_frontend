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
    queryKey: [CHAT_MESSAGES_KEY, bookingId, page, limit],

    queryFn: () =>
      usecase.execute({
        bookingId,
        page,
        limit,
      }),

    enabled: !!bookingId,
  });
}