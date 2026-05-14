import type { UnregisterDeviceTokenPayload } from "../entities/UnregisterDeviceTokenPayload";
import type { NotificationRepository } from "../repositories/NotificationRepo";

export class UnregisterDeviceTokenUseCase {
  constructor(private repo: NotificationRepository) {}

  async execute(payload: UnregisterDeviceTokenPayload) {
    return this.repo.unregisterDeviceToken(payload);
  }
}
