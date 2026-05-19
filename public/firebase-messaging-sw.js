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

const shown = new Set();

// =========================
// BACKGROUND MESSAGE
// =========================
messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};

  const bookingId = data.bookingId;

  let url = "/notifications";

  if (data.type === "CHAT_MESSAGE") {
    url = `/message/${bookingId}`;
  } else if (data.type === "BOOKING_UPDATE") {
    url = `/jobtracking/${bookingId}`;
  }

  const id = data.notificationId;
  if (id && shown.has(id)) return;
  if (id) shown.add(id);

  self.registration.showNotification(data.title || "Notification", {
    body: data.body || data.message,
    icon: "/logo.png",
    badge: "/logo.png",

    actions: [
      { action: "open", title: "Open" },
      { action: "close", title: "Close" },
    ],

    data: { url },
  });
});

// =========================
// CLICK HANDLER
// =========================
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/notifications";

  event.waitUntil((async () => {
    if (event.action === "close") return;

    const clientsList = await clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    });

    // send navigation message to React
    for (const client of clientsList) {
      client.postMessage({
        type: "NAVIGATE",
        url,
      });
      return;
    }

    // fallback
    await clients.openWindow(url);
  })());
});