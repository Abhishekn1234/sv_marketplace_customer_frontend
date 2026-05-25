/* =========================
   SERVICE WORKER (PUSH)
========================= */

// Install event
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/* =========================
   PUSH EVENT (WEB PUSH API)
========================= */
self.addEventListener("push", function (event) {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (err) {
    data = { title: "Notification", message: "You have a new message" };
  }

  const title = data.title || "Notification";

  const options = {
    body: data.message || "You have a new notification",
    icon: "/logo.png",
    badge: "/logo.png",
    tag: data.id || "general",
    data: {
      url: data.url || "/",
      bookingId: data.bookingId || null,
      type: data.type || null,
    },
    actions: [
      {
        action: "open",
        title: "Open",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

/* =========================
   NOTIFICATION CLICK
========================= */
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const data = event.notification.data || {};
  let url = data.url || "/";

  // dynamic routing logic
  if (data.bookingId) {
    url = `/bookings/${data.bookingId}`;
  }

  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      // If app already open → focus it
      for (const client of allClients) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }

      // Otherwise open new tab
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })()
  );
});

/* =========================
   FCM BACKGROUND MESSAGE (IMPORTANT)
   (Only if using Firebase)
========================= */
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

messaging.onBackgroundMessage(async function (payload) {
  const title = payload.notification?.title || "Notification";
  const data = payload.data || {};
  const type = (data.type || "").toUpperCase();

  const options = {
    body: payload.notification?.body || "",
    icon: "/logo.png",
    badge: "/logo.png",
    requireInteraction: type === "ADMIN_MESSAGE",
    data: {
      url: type === "ADMIN_MESSAGE" ? "/notifications" : (data.url || "/"),
      bookingId: data.bookingId || null,
    },
  };

  await self.registration.showNotification(title, options);
});