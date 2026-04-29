import type { NotificationType } from "./notifications";

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  type?: NotificationType;
  unreadOnly?: boolean;
}
