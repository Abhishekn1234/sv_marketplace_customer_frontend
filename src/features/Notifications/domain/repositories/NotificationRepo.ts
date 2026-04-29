import type { GetNotificationsParams } from "../entities/notificationgetparams";
import type { Notification } from "../entities/notifications";
import type { RegisterDeviceTokenPayload } from "../entities/RegisterTokenPayload";
import type { UnregisterDeviceTokenPayload } from "../entities/UnregisterDeviceTokenPayload";

export interface NotificationRepository {
  getNotifications(params: GetNotificationsParams): Promise<Notification[]>;
  registerDeviceToken(
    payload: RegisterDeviceTokenPayload
  ): Promise<void>;
  unregisterDeviceToken(
    payload: UnregisterDeviceTokenPayload
  ): Promise<void>;
  getUnreadCount(): Promise<number>;
  markNotificationAsRead(notificationId: string): Promise<void>;
  markAllAsRead(): Promise<void>;
}
