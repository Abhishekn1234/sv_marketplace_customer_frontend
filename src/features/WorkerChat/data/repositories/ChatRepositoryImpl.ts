import apiClient from "@/features/api/interceptor";

import type {
  ChatMessage,
  GetChatMessagesPayload,
  GetChatMessagesResponse,
  SendChatMessagePayload,
} from "../../domain/entities/chat";

import type { ChatRepository } from "../../domain/repositories/ChatRepository";

export class ChatRepositoryImpl implements ChatRepository {
  async getMessages(
    payload: GetChatMessagesPayload
  ): Promise<GetChatMessagesResponse> {
    const { bookingId, page = 1, limit = 30 } = payload;

    const response = await apiClient.get(
      `/booking/chat/${bookingId}/messages`,
      {
        params: {
          page,
          limit,
        },
      }
    );

    return response.data;
  }

  async sendMessage(
    payload: SendChatMessagePayload
  ): Promise<ChatMessage> {
    const { bookingId, message } = payload;

    const response = await apiClient.post(
      `/booking/chat/${bookingId}/messages`,
      {
        message,
      }
    );

    return response.data;
  }
}