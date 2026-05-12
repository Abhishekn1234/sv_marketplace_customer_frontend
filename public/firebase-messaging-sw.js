importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js"
);

// ✅ FIREBASE INIT
firebase.initializeApp({
  apiKey: "AIzaSyChCuX9ZrzrZUmeSc7WO-3Nalq8t84Yjyo",
  authDomain: "sv-marketplace-46503.firebaseapp.com",
  projectId: "sv-marketplace-46503",
  storageBucket: "sv-marketplace-46503.appspot.com",
  messagingSenderId: "118069674424",
  appId: "1:118069674424:web:c21a0a1edbb9e808a94f4d",
});

const messaging = firebase.messaging();

const channel = new BroadcastChannel(
  "fcm_channel"
);

// ✅ TAKE CONTROL IMMEDIATELY
self.addEventListener(
  "activate",
  (event) => {
    event.waitUntil(
      self.clients.claim()
    );
  }
);

// ✅ FORCE UPDATE
self.addEventListener(
  "message",
  (event) => {
    if (
      event.data?.type ===
      "SKIP_WAITING"
    ) {
      self.skipWaiting();
    }
  }
);

// ✅ BACKGROUND MESSAGE
messaging.onBackgroundMessage(
  async (payload) => {
    console.log(
      "📩 Background message:",
      payload
    );

    const data =
      payload.data || {};

    const title =
      payload.notification?.title ||
      data.title ||
      "New Notification";

    const body =
      payload.notification?.body ||
      data.body ||
      "";

    // ✅ UNIQUE TAG
    const tag =
      data.notificationId ||
      data.id ||
      `${Date.now()}-${Math.random()}`;

    // ✅ NAVIGATION URL
    let url = "/notifications";

   switch (data.type) {
  case "CHAT_MESSAGE":
    url = `/message/${data.senderId}/${data.bookingId}`;
    break;

  case "BOOKING_CREATED":
    url = `/bookingdetail/${data.serviceId}/${data.serviceTierId}`;
    break;

  case "JOB_TRACKING":
    url = `/jobtracking/${data.bookingId}`;
    break;

  case "JOB_PROGRESS":
    url = `/jobprogress/${data.bookingId}`;
    break;

  case "VIDEO_CALL":
    url = `/video-call/${data.senderId}`;
    break;

  default:
    url ="/notifications";
}

    // ✅ ADD QUERY PARAMS
    url = buildNotificationUrl(
      url,
      {
        messageId:
          data.messageId,
        senderId:
          data.senderId,
        text:
          data.text ||
          data.message,
        timestamp:
          data.timestamp,
      }
    );

    // ✅ ACTIONS
    let actions = [];

    switch (data.type) {
      case "CHAT_MESSAGE":
        actions = [
          {
            action: "open_chat",
            title: "Open Chat",
          },
        ];
        break;

      case "JOB_TRACKING":
        actions = [
          {
            action: "track_job",
            title: "Track Job",
          },
        ];
        break;

      case "VIDEO_CALL":
        actions = [
          {
            action: "join_call",
            title: "Join Call",
          },
        ];
        break;

      default:
        actions = [
          {
            action: "open",
            title: "Open",
          },
        ];
    }

    // ✅ SHOW NOTIFICATION
    self.registration.showNotification(
      title,
      {
        body,

        icon: "/logo.png",
        badge: "/logo.png",

        tag,

        renotify: true,

        requireInteraction: true,

        actions,

        data: {
          ...data,
          url,
        },
      }
    );
  }
);

// ✅ BUILD URL
function buildNotificationUrl(
  url,
  params
) {
  const hasParams =
    Object.keys(params).some(
      (key) => Boolean(params[key])
    );

  if (!hasParams) return url;

  const target = new URL(
    url,
    self.location.origin
  );

  Object.keys(params).forEach(
    (key) => {
      if (params[key]) {
        target.searchParams.set(
          key,
          String(params[key])
        );
      }
    }
  );

  return `${target.pathname}${target.search}`;
}

// ✅ CLICK HANDLER
self.addEventListener(
  "notificationclick",
  (event) => {
    event.notification.close();

    const data =
      event.notification.data || {};

    let targetUrl =
      data.url ||
      "/notifications";

    // ✅ ACTION BUTTONS
    switch (event.action) {
      case "open_chat":
        targetUrl = `/message/${data.workerId}/${data.bookingId}`;
        break;

      case "track_job":
        targetUrl = `/jobtracking/${data.bookingId}`;
        break;

      case "join_call":
        targetUrl = `/video-call/${data.workerId}`;
        break;

      default:
        break;
    }

    event.waitUntil(
      handleNavigation(targetUrl)
    );
  }
);

// ✅ NAVIGATION
async function handleNavigation(
  targetUrl
) {
  const clientList =
    await clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    });

  // ✅ EXISTING TAB
  for (const client of clientList) {
    if (
      client.url.startsWith(
        self.location.origin
      )
    ) {
      await client.focus();

      // ✅ direct message
      client.postMessage({
        type: "NAVIGATE",
        url: targetUrl,
      });

      // ✅ broadcast fallback
      channel.postMessage({
        type: "NAVIGATE",
        url: targetUrl,
      });

      return;
    }
  }

  // ✅ NEW TAB
  await clients.openWindow(
    targetUrl
  );
}