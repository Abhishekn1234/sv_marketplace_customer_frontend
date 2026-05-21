import { QueryClient } from "@tanstack/react-query";
import { notificationKeys } from "../hooks/useNotifications";

/**
 * Sync a single notification into React Query cache
 * Works for:
 * - FCM foreground
 * - Service worker events
 * - manual inserts
 */
export const syncNotificationToCache = (
  queryClient: QueryClient,
  notification: any
) => {
  if (!notification?._id) return;

  queryClient.setQueriesData(
    { queryKey: notificationKeys.all },
    (old: any) => {
      if (!old) {
        return {
          data: [notification],
          pagination: {
            totalItems: 1,
          },
        };
      }

      const exists = old?.data?.some(
        (item: any) => item?._id === notification._id
      );

      if (exists) return old;

      return {
        ...old,
        data: [notification, ...(old?.data || [])],
        pagination: {
          ...old?.pagination,
          totalItems: (old?.pagination?.totalItems || 0) + 1,
        },
      };
    }
  );
};

/**
 * Optional helper: bulk sync (API → cache)
 */
export const syncNotificationsBulkToCache = (
  queryClient: QueryClient,
  notifications: any[]
) => {
  if (!Array.isArray(notifications)) return;

  notifications.forEach((n) => {
    syncNotificationToCache(queryClient, n);
  });
};