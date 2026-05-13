import {
  getToken,
  onMessage,
} from "firebase/messaging";

import { getFirebaseMessaging } from "./messaging";

const VAPID_KEY =
  import.meta.env
    .VITE_FIREBASE_VAPID_KEY;

// =========================
// TOKEN
// =========================

export async function requestAndGetToken() {
  try {
    const messaging =
      await getFirebaseMessaging();

    if (!messaging) return null;

    const permission =
      await Notification.requestPermission();

    if (permission !== "granted")
      return null;

    const registration =
      await navigator.serviceWorker.ready;

    return await getToken(
      messaging,
      {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration:
          registration,
      }
    );
  } catch (err) {
    console.error(
      "FCM error:",
      err
    );

    return null;
  }
}

// =========================
// FOREGROUND
// =========================

export async function initOnMessage(
  setNotifications?: any
) {
  const messaging =
    await getFirebaseMessaging();

  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log(
      "📩 Foreground:",
      payload
    );

    const data =
      payload.data || {};

    const notification = {
      id:
        data.notificationId ||
        payload.messageId,

      title:
        data.title ||
        "Notification",

      message:
        data.body ||
        "You have a new update",

      data,
    };

    // ✅ ONLY STATE UPDATE
    // ❌ NO showNotification
    // ❌ NO new Notification()
    // ❌ NO duplicate popup

    setNotifications?.((prev: any) => [
      notification,
      ...prev,
    ]);
  });
}