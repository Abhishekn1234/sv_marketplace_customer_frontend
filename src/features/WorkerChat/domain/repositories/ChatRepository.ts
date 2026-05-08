import type {
  GetChatMessagesPayload,
  GetChatMessagesResponse,
  SendChatMessagePayload,
  ChatMessage,
} from "../entities/chat";

export interface ChatRepository {
  getMessages(
    payload: GetChatMessagesPayload
  ): Promise<GetChatMessagesResponse>;

  sendMessage(
    payload: SendChatMessagePayload
  ): Promise<ChatMessage>;
}