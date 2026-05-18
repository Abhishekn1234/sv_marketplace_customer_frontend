importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyChCuX9ZrzrZUmeSc7WO-3Nalq8t84Yjyo",
  authDomain: "sv-marketplace-46503.firebaseapp.com",
  projectId: "sv-marketplace-46503",
  storageBucket: "sv-marketplace-46503.appspot.com",
  messagingSenderId: "118069674424",
  appId: "1:118069674424:web:c21a0a1edbb9e808a94f4d",
});
const messaging = firebase.messaging();

function buildRoute(data) {
  const bookingId = data?.bookingId;

  if (!bookingId) return "/notifications";

  switch (data?.type) {
    case "CHAT_MESSAGE":
      return `/message/${bookingId}`;

    case "BOOKING_UPDATE":
      return `/jobtracking/${bookingId}`;

    case "WORK_ASSIGNED":
      return `/jobprogress/${bookingId}`;

    default:
      return "/notifications";
  }
}

messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};
  const url = buildRoute(data);

  self.registration.showNotification(data.title || "Notification", {
    body: data.body || data.message,
    icon: "/logo.png",
    data: {
      ...data,
      url,
    },
    requireInteraction: true,
  });
});

self.addEventListener("notificationclick", async (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  const url = data.url || "/notifications";

  const clientsList = await clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });

  // existing tab
  if (clientsList.length > 0) {
    const client = clientsList[0];

    client.focus();

    client.postMessage({
      type: "NAVIGATE",
      url,
      payload: data,
    });

    return;
  }

  // no tab open
  await clients.openWindow(url);
});