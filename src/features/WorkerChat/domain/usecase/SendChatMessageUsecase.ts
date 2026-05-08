import type {
  SendChatMessagePayload,
  ChatMessage,
} from "../entities/chat";

import type { ChatRepository } from "../repositories/ChatRepository";

export class SendChatMessageUsecase {
  constructor(private repository: ChatRepository) {}

  execute(
    payload: SendChatMessagePayload
  ): Promise<ChatMessage> {
    return this.repository.sendMessage(payload);
  }
}