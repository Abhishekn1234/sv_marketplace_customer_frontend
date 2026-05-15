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

    console.log("🔥 FCM Token:", token);
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
  setNotifications?: React.Dispatch<React.SetStateAction<any[]>>
) {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    // console.log("📩 Foreground FCM:", payload);

    const data = payload.data || {};

    const notification = {
      id:
        data.notificationId ||
        payload.messageId ||
        Date.now().toString(),

      title:
        payload.notification?.title ||
        data.title ||
        "Notification",

      message:
        payload.notification?.body ||
        data.body ||
        "You have a new update",

      type: data.type || "GENERAL",

      bookingId: data.bookingId || null,

      raw: data,
    };

    // console.log("✅ Parsed Notification:", notification);

    // =========================
    // UPDATE STATE SAFELY
    // =========================
    setNotifications?.((prev: any[] = []) => {
      return [notification, ...prev];
    });

    // =========================
    // OPTIONAL: system notification in foreground
    // =========================
    if (Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/logo.png",
        data: notification,
      });
    }
  });
}