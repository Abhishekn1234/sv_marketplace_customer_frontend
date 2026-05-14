import type { RegisterDeviceTokenPayload } from "../entities/RegisterTokenPayload";
import type { NotificationRepository } from "../repositories/NotificationRepo";

export class RegisterDeviceTokenUseCase {
  constructor(private repo: NotificationRepository) {}

  async execute(payload: RegisterDeviceTokenPayload) {
    return this.repo.registerDeviceToken(payload);
  }
}