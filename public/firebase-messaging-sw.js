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
  const bookingId = data.bookingId;
  const workerId = data.workerId;

  switch (data.type) {
    case "CHAT_MESSAGE":
      return `/message/${workerId}/${bookingId}`;

    case "BOOKING_UPDATE":
      return `/jobtracking/${bookingId}`;

    case "WORK_ASSIGNED":
      return `/jobprogress/${bookingId}`;

    default:
      return "/notifications";
  }
}

messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background:", payload);

  const data = payload.data || {};

  const url = buildRoute(data);

  self.registration.showNotification(
    data.title || "Notification",
    {
      body: data.message || data.body,
      icon: "/logo.png",
      badge: "/logo.png",

      data: {
        ...data,
        url,
      },

      requireInteraction: true,

      actions: [
        {
          action: "open",
          title: "Open",
        },
      ],
    }
  );
});

self.addEventListener(
  "notificationclick",
  async (event) => {
    event.notification.close();

    const data =
      event.notification.data || {};

    const url =
      data.url || "/notifications";

    const allClients =
      await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

    // existing tab
    for (const client of allClients) {
      const clientUrl = new URL(
        client.url
      );

      const targetUrl = new URL(
        url,
        self.location.origin
      );

      // same origin
      if (
        clientUrl.origin ===
        targetUrl.origin
      ) {
        // send live data without reload
        client.postMessage({
          type: "PUSH_NAVIGATION",
          url,
          payload: data,
        });

        client.focus();

        return;
      }
    }

    // no existing tab
    clients.openWindow(url);
  }
);