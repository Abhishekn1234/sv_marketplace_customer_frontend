import type {
  GetChatMessagesPayload,
  GetChatMessagesResponse,
} from "../entities/chat";

import type { ChatRepository } from "../repositories/ChatRepository";

export class GetChatMessagesUsecase {
  constructor(private repository: ChatRepository) {}

  execute(
    payload: GetChatMessagesPayload
  ): Promise<GetChatMessagesResponse> {
    return this.repository.getMessages(payload);
  }
}