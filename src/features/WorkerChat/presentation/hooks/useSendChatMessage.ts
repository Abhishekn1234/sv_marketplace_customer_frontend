import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { ChatRepositoryImpl } from "../../data/repositories/ChatRepositoryImpl";
import { SendChatMessageUsecase } from "../../domain/usecase/SendChatMessageUsecase";
import { CHAT_MESSAGES_KEY } from "./useGetChatMessages";

import type { ChatMessage, SendChatMessagePayload } from "../../domain/entities/chat";

const repository = new ChatRepositoryImpl();
const usecase = new SendChatMessageUsecase(repository);

export function useSendChatMessage() {
  const queryClient = useQueryClient();

  return useMutation<ChatMessage, Error, SendChatMessagePayload>({
    mutationFn: (payload) => usecase.execute(payload),

    onSuccess: (response, variables) => {
      toast.success("Message sent");

      // 🔥 CRITICAL: update UI instantly
      queryClient.setQueryData(
        [CHAT_MESSAGES_KEY, variables.bookingId],
        (old: any) => {
          const oldMessages = Array.isArray(old?.data)
            ? old.data
            : [];

          return {
            data: [...oldMessages, response],
          };
        }
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to send message"
      );
    },
  });
}