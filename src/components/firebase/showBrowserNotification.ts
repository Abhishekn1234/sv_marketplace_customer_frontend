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
  const data = payload.data || {};
  const baseUrl = data.url || (
    data.bookingId && data.workerId
      ? `/message/${data.workerId}/${data.bookingId}`
      : "/notifications"
  );
  const url = buildNotificationUrl(baseUrl, {
    messageId: data.messageId || data.id,
    text: data.text || data.message || payload.notification?.body,
    senderId: data.senderId,
    timestamp: data.timestamp || data.createdAt,
  });

  const options: SWNotificationOptions = {
    body: payload.notification?.body || "You have a new update.",
    icon: "/notification.png",
    badge: "/badge.png",

    data: { ...data, url },

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

function buildNotificationUrl(url: string, message: Record<string, any>) {
  const hasMessage = Object.values(message).some(Boolean);
  if (!hasMessage) return url;

  const target = new URL(url, window.location.origin);

  Object.entries(message).forEach(([key, value]) => {
    if (value) target.searchParams.set(key, String(value));
  });

  return `${target.pathname}${target.search}`;
}
