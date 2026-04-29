import type { NotificationRepository } from "../repositories/NotificationRepo";

export class MarkAllNotificationsReadUseCase {
  constructor(private repo: NotificationRepository) {}

  async execute() {
    return this.repo.markAllAsRead();
  }
}

