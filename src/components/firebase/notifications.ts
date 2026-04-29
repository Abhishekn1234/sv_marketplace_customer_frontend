// src/components/firebase/notifications.ts

import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "./messaging";
import { showBrowserNotification } from "./showBrowserNotification";

const VAPID_KEY = "BI2b4vrUDzHchIB1c-679DSWk1wD2weRFgDGihHy5VA0XkVP_lYcALYnK54v6aO8hQ4W8h28eql26_ZySjN2yRI";

export async function requestAndGetToken() {
  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("❌ Notification permission denied");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
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

// ✅ Foreground notifications → update UI
// notifications.ts


export async function initOnMessage(setNotifications?: any) {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("📩 Foreground message:", payload);

    const newNotification = {
      id: payload.messageId || crypto.randomUUID(),
      title: payload.notification?.title || "New Notification",
      message: payload.notification?.body || "",
      type: "ADMIN_MESSAGE",
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    /* ✅ FIX: Only call if setter exists */
    if (setNotifications) {
      setNotifications((prev: any) => [newNotification, ...prev]);
    }

    /* ✅ ALWAYS show browser notification */
    showBrowserNotification(payload);
  });
}