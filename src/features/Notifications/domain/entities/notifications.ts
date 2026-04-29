// domain/entities/Notification.ts

export type NotificationType =
  | "BOOKING_REQUEST"
  | "BOOKING_UPDATE"
  | "ADMIN_MESSAGE";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}