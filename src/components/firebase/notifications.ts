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
// FOREGROUND LISTENER (FIXED)
// =========================
export async function initOnMessage(setNotifications?: any) {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    const data = payload.data || {};
    console.log("📩 FCM Message received:", payload);
    const bookingId = data.bookingId;

    const notification = {
      id: data.notificationId || Date.now().toString(),
      title: payload.notification?.title || "Notification",
      message: payload.notification?.body || "New message",
      type: data.type,
      bookingId,
      raw: data,
    };

    setNotifications?.((prev: any) => [notification, ...prev]);

  if (Notification.permission === "granted") {
  const url = `/message/${bookingId}`;

  const n = new Notification(notification.title, {
    body: notification.message,
    icon: "/logo.png",
  });

  n.onclick = () => {
    n.close();

    const channel = new BroadcastChannel("fcm_channel");

    channel.postMessage({
      type: "NAVIGATE",
      url,
      payload: notification,
    });

    channel.close();
  };
}
  });
}