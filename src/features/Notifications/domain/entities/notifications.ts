// domain/entities/notification.types.ts

export type NotificationType =
  | "BOOKING_REQUEST"
  | "BOOKING_UPDATE"
  | "ADMIN_MESSAGE";

/**
 * Single Notification Item
 * Matches backend response exactly
 */
export interface Notification {
  _id: string;

  recipientType: "CUSTOMER" | "WORKER" | "ADMIN";
  recipientId: string;

  type: NotificationType;

  title: string;
  message: string;

  bookingId?: string;

  data?: {
    bookingCode?: string;
    status?: string;
    workerId?: string;

    actualWorkHours?: number;
    actualWorkDays?: number;

    invoiceId?: string;

    cancelReasonType?: string;
  };

  isRead: boolean;

  expiresAt?: string;

  createdAt: string;
  updatedAt: string;
}

/**
 * Pagination object from API
 */
export interface NotificationPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Full API response
 */
export interface NotificationResponse {
  data: Notification[];
  pagination: NotificationPagination;
}

/**
 * Optional helper type for hook return (recommended)
 */
export interface UseNotificationsResult {
  notifications: Notification[];
  pagination: NotificationPagination;
}