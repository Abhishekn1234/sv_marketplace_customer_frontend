import type { NotificationRepository } from "../repositories/NotificationRepo";

export class MarkNotificationReadUseCase {
  constructor(private repo: NotificationRepository) {}

  async execute(notificationId: string) {
    return this.repo.markNotificationAsRead(notificationId);
  }
}

