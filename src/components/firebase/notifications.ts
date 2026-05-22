import { getToken, onMessage } from "firebase/messaging";
import type { Dispatch, SetStateAction } from "react";
import { getFirebaseMessaging } from "./messaging";
import buildRoute from "./buildNotificationUrl";
import { getTitleByType } from "./getTitleByType";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

type NotificationPayload = {
  title?: string;
  body?: string;
};

const isChatNotification = (data: any) => {
  const senderType = data.senderType || data.sender;

  return (
    data.type === "CHAT_MESSAGE" ||
    senderType === "WORKER" ||
    senderType === "worker"
  );
};

const getMessageText = (data: any, fallback?: string) =>
  data.body ||
  data.message ||
  data.text ||
  data.content ||
  fallback ||
  "New message";

const getWorkerName = (data: any) =>
  data.workerName ||
  data.senderName ||
  data.senderFullName ||
  data.workerFullName ||
  data.fullName ||
  "Worker";

const buildNotificationDisplay = (
  data: any,
  notification?: NotificationPayload
) => {
  const type = data.type;

  if (isChatNotification(data)) {
    return {
      title: getWorkerName(data),
      body: getMessageText(data, notification?.body),
    };
  }

  if (type === "ADMIN_MESSAGE") {
    return {
      title: data.title || notification?.title || "Admin Message",
      body: getMessageText(data, notification?.body),
    };
  }

  return {
    title: notification?.title || data.title || getTitleByType(type),
    body: getMessageText(data, notification?.body),
  };
};

const normalizePath = (path: string) => {
  try {
    return new URL(path, window.location.origin).pathname;
  } catch {
    return path;
  }
};

export async function requestAndGetToken() {
  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const registration = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    console.log("FCM TOKEN:", token);
    return token;
  } catch (err) {
    console.error("FCM token error:", err);
    return null;
  }
}

export async function initOnMessage(
  setNotifications?: Dispatch<SetStateAction<any[]>>
) {
  const messaging = await getFirebaseMessaging();

  if (!messaging) {
    console.error("Messaging not initialized");
    return;
  }

  onMessage(messaging, async (payload) => {
    console.log("FOREGROUND:", payload);

    const data = payload.data || {};
    const type = data.type;

    const bookingId = data.bookingId;
    const senderType = data.senderType;

    // ROUTE
    const url =
      (senderType === "WORKER" || senderType === "worker") && bookingId
        ? `/message/${bookingId}`
        : buildRoute(data);

    const currentPath = normalizePath(window.location.pathname);
    const targetPath = normalizePath(url);

    // ❌ SKIP if user already on same page
    const isSamePage = currentPath === targetPath;

    // ❌ SKIP if user already inside same booking context
    const isInsideBooking =
      currentPath.startsWith("/message/") &&
      targetPath.startsWith("/message/");

    if (isSamePage || isInsideBooking) {
      console.log("Notification skipped (user already on page)");
      return;
    }

    // DISPLAY
    const display = buildNotificationDisplay(data, payload.notification);

    // SAFE NOTIFICATION ID
    const notificationId =
      data.notificationId ||
      data.messageId ||
      data._id ||
      crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random()}`;

    // DUPLICATE PREVENTION (session)
    const alreadyShown = sessionStorage.getItem(`notif_${notificationId}`);
    if (alreadyShown) return;

    sessionStorage.setItem(`notif_${notificationId}`, "1");

    // STATE UPDATE
    setNotifications?.((prev) => [
      {
        ...data,
        title: display.title,
        body: display.body,
        id: notificationId,
      },
      ...prev,
    ]);

    try {
      const registration = await navigator.serviceWorker.ready;

      await registration.showNotification(display.title, {
        body: display.body,
        icon: "/logo.png",
        badge: "/logo.png",
        tag: notificationId,
        renotify: true,
        actions: [{ action: "open", title: "Open" }],
        data: {
          url,
          bookingId,
          senderType,
          type,
        },
      } as NotificationOptions);
    } catch (err) {
      console.error("showNotification failed:", err);
    }
  });
}