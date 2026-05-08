importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyChCuX9ZrzrZUmeSc7WO-3Nalq8t84Yjyo",
  authDomain: "sv-marketplace-46503.firebaseapp.com",
  projectId: "sv-marketplace-46503",
  storageBucket: "sv-marketplace-46503.appspot.com",
  messagingSenderId: "118069674424",
  appId: "1:118069674424:web:c21a0a1edbb9e808a94f4d",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background message received:", payload);

  const title =
    payload.notification?.title ||
    payload.data?.title ||
    "New Notification";

  const body =
    payload.notification?.body ||
    payload.data?.body ||
    "";

  const data = payload.data || {};
  const baseUrl = data.url || (
    data.bookingId && data.workerId
      ? `/message/${data.workerId}/${data.bookingId}`
      : "/notifications"
  );
  const url = buildNotificationUrl(baseUrl, {
    messageId: data.messageId || data.id,
    text: data.text || data.message || body,
    senderId: data.senderId,
    timestamp: data.timestamp || data.createdAt,
  });

  self.registration.showNotification(title, {
    body,
    icon: "/logo.png",

    data: {
      ...data,
      url,
    },

    tag: payload.data?.id || "general",
    renotify: true,
    requireInteraction: true,

    actions: [
      {
        action: "open",
        title: "Open",
        icon: "/open.png",
      },
      // {
      //   action: "close",
      //   title: "Close",
      //   icon: "/close.png",
      // },
    ],
  });
});

function buildNotificationUrl(url, message) {
  const hasMessage = Object.keys(message).some((key) => Boolean(message[key]));
  if (!hasMessage) return url;

  const target = new URL(url, self.location.origin);

  Object.keys(message).forEach((key) => {
    if (message[key]) target.searchParams.set(key, String(message[key]));
  });

  return `${target.pathname}${target.search}`;
}


// firebase-messaging-sw.js

self.addEventListener("notificationclick", (event) => {
  const url = new URL(
    event.notification.data?.url || "/notifications",
    self.location.origin
  ).href;

  event.notification.close();

  event.waitUntil((async () => {
    // 🟢 Handle actions first
    if (event.action === "close") {
      return; // just exit
    }

    if (event.action === "open" || !event.action) {
      const clientsArr = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of clientsArr) {
        if ("navigate" in client && "focus" in client) {
          await client.navigate(url);
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    }
  })());
});
