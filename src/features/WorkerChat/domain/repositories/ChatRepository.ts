import type {
  GetChatMessagesPayload,
 
  SendChatMessagePayload,
  ChatMessage,
} from "../entities/chat";
import type { PaginatedMessages } from "../entities/messages";

export interface ChatRepository {
  getMessages(
    payload: GetChatMessagesPayload
  ): Promise<PaginatedMessages>;

  sendMessage(
    payload: SendChatMessagePayload
  ): Promise<ChatMessage>;
}