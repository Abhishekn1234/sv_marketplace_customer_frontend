interface NotificationActionItem {
  action: string;
  title: string;
  icon?: string;
}

interface SWNotificationOptions
  extends NotificationOptions {
  actions?: NotificationActionItem[];
  data?: any;
  renotify?: boolean;
}

export const showBrowserNotification =
  async (payload: any) => {
    if (
      Notification.permission !==
      "granted"
    ) {
      return;
    }

    const registration =
      await navigator.serviceWorker.ready;

    const data = payload.data || {};

    // CLEAN URL ONLY
    const url =
      data.url ||
      (data.bookingId &&
      data.workerId
        ? `/message/${data.workerId}/${data.bookingId}`
        : "/notifications");

    const options: SWNotificationOptions =
      {
        body:
          payload.notification?.body ||
          "You have a new update.",

        icon: "/notification.png",

        badge: "/badge.png",

        data: {
          url,
        },

        tag:
          payload.data?.id ||
          "general",

        renotify: true,

        requireInteraction: true,

        actions: [
          {
            action: "open",
            title: "Open",
            icon: "/open.png",
          },
        ],
      };

    registration.showNotification(
      payload.notification?.title ||
        "New Notification",
      options
    );
  };