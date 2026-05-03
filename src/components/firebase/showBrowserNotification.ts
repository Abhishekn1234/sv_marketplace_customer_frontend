interface NotificationActionItem {
  action: string;
  title: string;
  icon?: string;
}

interface SWNotificationOptions extends NotificationOptions {
  actions?: NotificationActionItem[];
  data?: any;
  renotify?: boolean;
}

export const showBrowserNotification = async (payload: any) => {
  if (Notification.permission !== "granted") return;

  const registration = await navigator.serviceWorker.ready;
  const url = payload.data?.url || "/notifications";

  const options: SWNotificationOptions = {
    body: payload.notification?.body || "You have a new update.",
    icon: "/notification.png",
    badge: "/badge.png",

    data: { url },

    tag: payload.data?.id || "general",
    renotify: true,
    requireInteraction: true,

    actions: [
      {
        action: "open",
        title: "Open",
        icon: "/open.png",
      },
      // {
      //   action: "close",
      //   title: "Close",
      //   icon: "/close.png",
      // },
    ],
  };

  registration.showNotification(
    payload.notification?.title || "New Notification",
    options
  );
};