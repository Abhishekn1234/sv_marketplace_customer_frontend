// firebaseNotification.ts

import { getToken, onMessage } from "firebase/messaging";
import type { QueryClient } from "@tanstack/react-query";




import { getFirebaseMessaging } from "@/components/firebase/messaging";
// import { showWebPushNotification } from "../utils/notificationwebpush";
import { syncNotificationToCache } from "../utils/syncnotification";


const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export async function requestNotificationPermissions() {
  const permission = await Notification.requestPermission();

  if (permission !== "granted") return null;

  // 🔥 REGISTER SERVICE WORKER FIRST
  const registration = await navigator.serviceWorker.register(
     "/firebase-messaging-sw.js"
  );
  console.log("Service Worker registered with scope:", registration.scope);

  const messaging = await getFirebaseMessaging();

  if (!messaging) return null;

  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration, // IMPORTANT FIX
  });

  // console.log("FCM TOKEN:", token);

  return token;
}

export async function initOnMessages(queryClient: QueryClient) {
  const messaging = await getFirebaseMessaging();

  if (!messaging) {
    console.error("Messaging not initialized");
    return;
  }

  onMessage(messaging, async (payload) => {
    console.log("FOREGROUND:", payload);

    const data = payload.data || {};

    const notificationItem = {
      _id: data.id || Date.now().toString(),
      title: data.title,
      body: data.body,
      type: data.type,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    // 🔥 Update React Query cache instantly
    syncNotificationToCache(queryClient, notificationItem);
    //   notificationEventBus.emit(notificationItem);

    // 🔥 Browser Push Notification
    // showWebPushNotification({
    //   title: data.title || "New Notification",
    //   body: data.body || "",
    //   route: "/notifications",
    //   icon: "/logo.png",
    // });
  });
}