type AppNotificationParams = {
  title: string;
  body: string;
  url: string;
  bookingId?: string;
  senderType?: string;
  notificationId?: string;
};

export const showAppNotification = async ({
  title,
  body,
  url,
  bookingId,
  senderType = "WORKER",
  notificationId,
}: AppNotificationParams) => {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    console.warn("Notifications are not supported in this browser");
    return;
  }

  let permission = Notification.permission;

  if (permission === "default") {
    permission = await Notification.requestPermission();
  }

  if (permission !== "granted") {
    console.warn("Notification permission is not granted");
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
        type: "CHAT_MESSAGE",
        notificationId: tag,
      },
    } as NotificationOptions);
  } catch (error) {
    console.error("Failed to show app notification:", error);
  }
};
