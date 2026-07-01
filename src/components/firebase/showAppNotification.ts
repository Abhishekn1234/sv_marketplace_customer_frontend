type AppNotificationParams = {
  title: string;
  body: string;
  url: string;
  bookingId?: string;
  senderType?: string;
  notificationId?: string;
  type?: string;
};

export const showAppNotification = async ({
  title,
  body,
  url,
  bookingId,
  senderType = "WORKER",
  notificationId,
  type = "CHAT_MESSAGE",
}: AppNotificationParams) => {
  const normalizePath = (path: string) => {
    try {
      return new URL(path, window.location.origin).pathname;
    } catch {
      return path;
    }
  };

  try {
    const current = normalizePath(window.location.pathname);
    const target = normalizePath(url || "");

    if (current === target) {
      return;
    }
  } catch {
  }
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    return;
  }

  let permission = Notification.permission;

  if (permission === "default") {
    permission = await Notification.requestPermission();
  }

  if (permission !== "granted") {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const tag =
      notificationId ||
      (bookingId ? `chat-${bookingId}-${Date.now()}` : `chat-${Date.now()}`);

    await registration.showNotification(title, {
      body,
      icon: "/logo.png",
      badge: "/logo.png",
      tag,
      actions: [{ action: "open", title: "Open" }],
      data: {
        url,
        bookingId,
        senderType,
        type,
        notificationId: tag,
      },
    } as NotificationOptions);
  } catch {
  }
};
