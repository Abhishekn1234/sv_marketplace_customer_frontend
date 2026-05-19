import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "./messaging";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// =========================
// TOKEN
// =========================
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

    console.log("🔥 FCM TOKEN:", token);

    return token;
  } catch (err) {
    console.error("FCM token error:", err);
    return null;
  }
}

// =========================
// FOREGROUND LISTENER
// =========================
export async function initOnMessage(
  pushNotification?: (notification: any) => void
) {
  const messaging = await getFirebaseMessaging();

  if (!messaging) return;

  onMessage(messaging, async (payload) => {
    console.log("📩 FOREGROUND:", payload);

    const data = payload.data || {};

    const bookingId = data.bookingId;

    // =========================
    // NAVIGATION URL
    // =========================
    let url = "/notifications";

    if (data.type === "CHAT_MESSAGE") {
      url = `/message/${bookingId}`;
    } else if (data.type === "BOOKING_UPDATE") {
      url = `/jobtracking/${bookingId}`;
    }

    // =========================
    // NOTIFICATION OBJECT
    // =========================
    const notification = {
      id: data.notificationId || crypto.randomUUID(),

      title:
        payload.notification?.title ||
        data.title ||
        "Notification",

      message:
        payload.notification?.body ||
        data.body ||
        data.message ||
        "New message",

      type: data.type,

      bookingId,

      isRead: false,

      createdAt: new Date().toISOString(),
    };

    // =========================
    // UPDATE ZUSTAND
    // =========================
    pushNotification?.(notification);

    // =========================
    // SHOW SYSTEM NOTIFICATION
    // =========================
    const registration =
      await navigator.serviceWorker.ready;

    await registration.showNotification(
      notification.title,
      {
        body: notification.message,

        icon: "/logo.png",

        badge: "/logo.png",

        tag: notification.id,

        renotify: true,

        requireInteraction: false,

        actions: [
          {
            action: "open",
            title: "Open",
          },
          {
            action: "close",
            title: "Close",
          },
        ],

        data: {
          url,
          bookingId,
          notificationId: notification.id,
        },
      } as NotificationOptions
    );
  });
}