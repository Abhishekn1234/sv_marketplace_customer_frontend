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
    // ❌ permission denied
    if (
      Notification.permission !==
      "granted"
    ) {
      return;
    }

    const registration =
      await navigator.serviceWorker.ready;

    const data =
      payload.data || {};

    // ✅ CHAT URL
    const url =
      data.url ||
      `/message/${data.workerId}/${data.bookingId}`;

    // ✅ UNIQUE TAG
    const tag =
      data.notificationId ||
      `${Date.now()}-${Math.random()}`;

    const options: SWNotificationOptions =
      {
        body:
          payload.notification
            ?.body ||
          "You have a new message",

        icon: "/notification.png",

        badge: "/badge.png",

        requireInteraction: true,

        renotify: true,

        // ✅ ONLY OPEN BUTTON
        actions: [
          {
            action: "open",
            title: "Open",
            icon: "/open.png",
          },
        ],

        // ✅ NAVIGATION DATA
        data: {
          ...data,
          url,
        },

        // ✅ MULTIPLE NOTIFICATIONS
        tag,
      };

    await registration.showNotification(
      payload.notification
        ?.title ||
        "New Notification",
      options
    );
  };