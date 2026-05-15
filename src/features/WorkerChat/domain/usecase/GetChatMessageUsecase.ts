import type {
  GetChatMessagesPayload,
  
} from "../entities/chat";
import type { PaginatedMessages } from "../entities/messages";

import type { ChatRepository } from "../repositories/ChatRepository";

export class GetChatMessagesUsecase {
  constructor(private repository: ChatRepository) {}

  execute(
    payload: GetChatMessagesPayload
  ): Promise<PaginatedMessages> {
    return this.repository.getMessages(payload);
  }
}