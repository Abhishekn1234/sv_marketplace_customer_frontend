// src/components/firebase/notifications.ts

import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "./messaging";
import { showBrowserNotification } from "./showBrowserNotification";
import { playNotificationSound } from "./sound";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export async function requestAndGetToken() {
  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("❌ Notification permission denied");
      return null;
    }

   const registration = await navigator.serviceWorker.ready;

        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration,
        });
    if (token) {
      console.log("📲 FCM Token:", token);
      return token;
    } else {
      console.warn("❌ No FCM token");
    }
  } catch (err) {
    console.error("❌ FCM error:", err);
  }
}




export async function initOnMessage(setNotifications?: any) {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return;

  onMessage(messaging, (payload) => {
  console.log("📩 Foreground message:", payload);

  playNotificationSound(); 

  const newNotification = {
    id: payload.messageId || crypto.randomUUID(),
    title: payload.notification?.title || "New Notification",
    message: payload.notification?.body || "",
    type: "ADMIN_MESSAGE",
    isRead: false,
    createdAt: new Date().toISOString(),
    data: payload.data,
    url: payload.data?.url,
    bookingId: payload.data?.bookingId,
    workerId: payload.data?.workerId,
    senderId: payload.data?.senderId,
  };

  if (setNotifications) {
    setNotifications((prev: any) => [newNotification, ...prev]);
  }

  showBrowserNotification(payload);
});
}
