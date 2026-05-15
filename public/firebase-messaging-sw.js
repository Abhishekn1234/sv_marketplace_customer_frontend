importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js"
);

// ✅ FIREBASE INIT
firebase.initializeApp({
  apiKey:
    "AIzaSyChCuX9ZrzrZUmeSc7WO-3Nalq8t84Yjyo",

  authDomain:
    "sv-marketplace-46503.firebaseapp.com",

  projectId:
    "sv-marketplace-46503",

  storageBucket:
    "sv-marketplace-46503.appspot.com",

  messagingSenderId:
    "118069674424",

  appId:
    "1:118069674424:web:c21a0a1edbb9e808a94f4d",
});

const messaging = firebase.messaging();

// =========================
// ROUTE BUILDER
// =========================
function buildRoute(data) {
  const bookingId = data.bookingId;
  const workerId = data.workerId;

  switch (data.type) {
    case "CHAT_MESSAGE":
      return workerId && bookingId
        ? `/message/${workerId}/${bookingId}`
        : "/notifications";

    case "BOOKING_UPDATE":
      return `/jobtracking/${bookingId}`;

    case "WORK_ASSIGNED":
      return `/jobprogress/${bookingId}`;

    default:
      return "/notifications";
  }
}

// =========================
// BACKGROUND NOTIFICATION
// =========================

messaging.onBackgroundMessage((payload) => {
  console.log("📩 SW Background:", payload);

  const data = payload.data || {};

  const title =
    payload.notification?.title ||
    data.title ||
    "Notification";

  const body =
    payload.notification?.body ||
    data.body ||
    "You have a new update";

  const url = buildRoute(data);

  const tag = `${data.type}-${data.messageId || data.bookingId}`;

  self.registration.showNotification(title, {
    body,
    icon: "/logo.png",
    badge: "/logo.png",
    tag,
    renotify: false,
    requireInteraction: true,
    data: {
      ...data,
      url,
    },
    actions: [
      {
        action: "open",
        title: "Open",
      },
    ],
  });
});

// =========================
// CLICK HANDLER
// =========================

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/notifications";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});