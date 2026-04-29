import type { NotificationRepository } from "../repositories/NotificationRepo";

export class GetUnreadCountUseCase {
  constructor(private repo: NotificationRepository) {}

  async execute() {
    return this.repo.getUnreadCount();
  }
}

