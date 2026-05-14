import apiClient from "@/features/api/interceptor";
import type { GetNotificationsParams } from "../../domain/entities/notificationgetparams";
import type { NotificationRepository } from "../../domain/repositories/NotificationRepo";
import type {  NotificationResponse } from "../../domain/entities/notifications";
import type { RegisterDeviceTokenPayload } from "../../domain/entities/RegisterTokenPayload";
import type { UnregisterDeviceTokenPayload } from "../../domain/entities/UnregisterDeviceTokenPayload";

export class NotificationRepositoryImpl implements NotificationRepository {
async getNotifications(
  params: GetNotificationsParams
): Promise<NotificationResponse> {
  const response = await apiClient.get<NotificationResponse>(
    "/notifications",
    {
      params: {
        page: params.page,
        limit: params.limit,
        type: params.type,
        unreadOnly: params.unreadOnly,
      } satisfies GetNotificationsParams, // ✅ type safety for params object
    }
  );

  return response.data;
}
   async registerDeviceToken(payload: RegisterDeviceTokenPayload): Promise<void> {
    const response= await apiClient.post("/notifications/device-token/register", payload);
    return response.data;
  }

  async unregisterDeviceToken(payload: UnregisterDeviceTokenPayload): Promise<void> {
    const response = await apiClient.post("/notifications/device-token/unregister", payload);
    return response.data;
  }

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get("/notifications/unread-count");
    return response.data.count;
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    const response = await apiClient.post(`/notifications/${notificationId}/read`);
    return response.data;
  }

  async markAllAsRead(): Promise<void> {
    const response = await apiClient.post("/notifications/read-all");
    return response.data;
  }
}
