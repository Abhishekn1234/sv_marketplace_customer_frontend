import type { GetNotificationsParams } from "../entities/notificationgetparams";
import type { NotificationRepository } from "../repositories/NotificationRepo";

export class GetNotificationsUseCase {
  constructor(private repo: NotificationRepository) {}

  async execute(params: GetNotificationsParams) {
    return this.repo.getNotifications(params);
  }
}