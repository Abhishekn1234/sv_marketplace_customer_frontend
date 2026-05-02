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

  const url = payload.data?.url || "/notifications";

  self.registration.showNotification(title, {
    body,
    icon: "/logo.png",

    data: {
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


// firebase-messaging-sw.js

self.addEventListener("notificationclick", (event) => {
  const url = event.notification.data?.url || "/notifications";

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
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    }
  })());
});