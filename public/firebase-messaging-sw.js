importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// =========================
// FIREBASE INIT
// =========================
firebase.initializeApp({
  apiKey: "AIzaSyChCuX9ZrzrZUmeSc7WO-3Nalq8t84Yjyo",
  authDomain: "sv-marketplace-46503.firebaseapp.com",
  projectId: "sv-marketplace-46503",
  storageBucket: "sv-marketplace-46503.appspot.com",
  messagingSenderId: "118069674424",
  appId: "1:118069674424:web:c21a0a1edbb9e808a94f4d",
});

const messaging = firebase.messaging();

// =========================
// SW LIFECYCLE
// =========================
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// =========================
// HELPERS
// =========================
const getId = (value) => {
  if (!value) return "";

  if (typeof value === "string") return value;

  return value._id || value.id || "";
};

const toAbsoluteUrl = (url) => {
  try {
    return new URL(
      url || "/notifications",
      self.location.origin
    ).href;
  } catch (_) {
    return new URL(
      "/notifications",
      self.location.origin
    ).href;
  }
};

const getType = (data = {}, payload = {}) => {
  return (
    data.type ||
    data.notificationType ||
    data.eventType ||
    payload.notification?.type ||
    ""
  )
    .toString()
    .toUpperCase();
};

const isAdminNotification = (data = {}, payload = {}) => {
  const type = getType(data, payload);
  const title = (
    data.title ||
    payload.notification?.title ||
    ""
  )
    .toString()
    .toUpperCase();

  return type === "ADMIN_MESSAGE" || title.includes("ADMIN");
};

// =========================
// ROUTE BUILDER
// =========================
const buildNotificationRoute = (data = {}, payload = {}) => {
  const type = getType(data, payload);

  // Admin messages should always land in the notifications center.
  if (isAdminNotification(data, payload)) {
    return "/notifications";
  }

  // Highest priority
  if (data.url) return data.url;

  const bookingId =
    getId(data.bookingId) ||
    getId(data.booking) ||
    getId(data.booking_id);

  const senderType =
    data.senderType || data.sender;

  // =========================
  // CHAT
  // =========================
  if (
    (type === "CHAT_MESSAGE" ||
      senderType === "WORKER" ||
      senderType === "worker") &&
    bookingId
  ) {
    return `/message/${bookingId}`;
  }

  // =========================
  // TRACKING
  // =========================
  if (
    (type === "BOOKING_UPDATE" ||
      type === "JOB_TRACKING") &&
    bookingId
  ) {
    return `/jobtracking/${bookingId}`;
  }

  // =========================
  // JOB PROGRESS
  // =========================
  if (
    type === "JOB_PROGRESS" &&
    bookingId
  ) {
    return `/jobprogress/${bookingId}`;
  }

  // =========================
  // BOOKING DETAIL
  // =========================
  if (
    type === "BOOKING_CREATED" &&
    data.serviceId &&
    data.serviceTierId
  ) {
    return `/bookingdetail/${data.serviceId}/${data.serviceTierId}`;
  }

  // =========================
  // VIDEO CALL
  // =========================
  if (
    type === "VIDEO_CALL" &&
    data.senderId
  ) {
    return `/video-call/${data.senderId}`;
  }

  // =========================
  // ADMIN
  // =========================
  // =========================
  // FALLBACK
  // =========================
  return "/notifications";
};

// =========================
// DISPLAY HELPERS
// =========================
const isChatNotification = (data = {}) => {
  const senderType =
    data.senderType || data.sender;

  const type = getType(data);
  return (
    type === "CHAT_MESSAGE" ||
    senderType === "WORKER" ||
    senderType === "worker"
  );
};

const getMessageText = (data = {}) => {
  return (
    data.body ||
    data.message ||
    data.description ||
    data.text ||
    data.content ||
    "New notification"
  );
};

const getWorkerName = (data = {}) => {
  return (
    data.workerName ||
    data.senderName ||
    data.senderFullName ||
    data.workerFullName ||
    data.fullName ||
    "Worker"
  );
};

const getTitleByType = (type) => {
  const t = (type || "").toUpperCase();
  switch (t) {
    case "BOOKING_CREATED":
    case "BOOKING_REQUEST":
      return "Booking Request";

    case "BOOKING_UPDATE":
    case "JOB_TRACKING":
      return "Booking Update";

    case "JOB_PROGRESS":
      return "Progress Update";

    case "BOOKING_CANCELLED":
      return "Booking Cancelled";

    case "BOOKING_COMPLETED":
      return "Booking Completed";

    case "VIDEO_CALL":
      return "Incoming Video Call";

    case "ADMIN_MESSAGE":
      return "Admin Message";

    default:
      return "Notification";
  }
};

const buildNotificationDisplay = (
  payload,
  data = {}
) => {
  // CHAT STYLE
  if (isChatNotification(data)) {
    return {
      title:
        payload.notification?.title ||
        getWorkerName(data),

      body:
        payload.notification?.body ||
        getMessageText(data),
    };
  }

  // NORMAL STYLE
  return {
    title:
      payload.notification?.title ||
      data.title ||
      getTitleByType(data.type),

    body:
      payload.notification?.body ||
      data.body ||
      getMessageText(data),
  };
};

// =========================
// NOTIFICATION TAG
// =========================
const getNotificationTag = (data = {}) => {
  const id = data.notificationId || data.messageId || data._id || data.id;
  if (id) return id;

  return (
    `${buildNotificationRoute(data)}-${getMessageText(data)}`
    // Add timestamp to ensure uniqueness if no ID is provided, preventing overwrite
    + `-${Date.now()}`
  );
};

// =========================
// BACKGROUND MESSAGE
// =========================
messaging.onBackgroundMessage(
  async (payload) => {
    console.log(
      "[firebase-messaging-sw.js] BG Message",
      payload
    );

    try {
      const data = payload.data || {};

      const type = getType(data, payload);
      const isAdmin = isAdminNotification(data, payload);

      const url =
        buildNotificationRoute(data, payload);

      const display =
        buildNotificationDisplay(
          payload,
          data
        );

      const tag =
        getNotificationTag(data);

      await self.registration.showNotification(
        display.title,
        {
          body: display.body,

          icon: "/logo.png",
          badge: "/logo.png",

          tag,
          renotify: true,

          requireInteraction: isAdmin,

          data: {
            url,
            type: data.type,
            bookingId: data.bookingId,
            senderType:
              data.senderType,
          },

          actions: [
            {
              action: "open",
              title: "Open",
            },
          ],
        }
      );
    } catch (error) {
      console.error(
        "Background notification error:",
        error
      );
    }
  }
);

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    return;
  }

  // Let Firebase handle data-only messages.
  if (payload?.data && Object.keys(payload.data).length > 0) {
    return;
  }

  const title =
    payload.notification?.title ||
    payload.title ||
    "Notification";

  const body =
    payload.notification?.body ||
    payload.message ||
    payload.body ||
    "You have a new notification";

  const url =
    payload.notification?.click_action ||
    payload.url ||
    "/notifications";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/logo.png",
      badge: "/logo.png",
      data: {
        url,
        type: payload.data?.type || payload.type,
        bookingId: payload.data?.bookingId || payload.bookingId,
      },
    })
  );
});

// =========================
// NOTIFICATION CLICK
// =========================
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification?.data || {};
  
  // If URL is missing (e.g. browser-shown notification), build it now
  const targetUrl = data.url || buildNotificationRoute(data);
  const absoluteUrl = toAbsoluteUrl(targetUrl);

  event.waitUntil(
    (async () => {
      try {
        if (event.action && event.action !== "open") return;

        const windowClients = await clients.matchAll({
          type: "window",
          includeUncontrolled: true,
        });

        const targetPath = new URL(
          absoluteUrl,
          self.location.origin
        ).pathname;

        // =========================
        // CHECK EXISTING TABS
        // =========================
        for (const client of windowClients) {
          const clientUrl = new URL(client.url, self.location.origin);
          const clientPath = clientUrl.pathname;

          const isSamePage = clientPath === targetPath;

          if (isSamePage) {
            // 👉 already on same page → just focus, no navigation
            await client.focus();
            
            client.postMessage({
              type: "NOTIFICATION_ALREADY_ON_PAGE",
              url: targetUrl,
            });

            return;
          }
        }

        // =========================
        // IF SAME ORIGIN TAB EXISTS → FOCUS + NAVIGATE
        // =========================
        for (const client of windowClients) {
          const isSameOrigin =
            client.url.startsWith(self.location.origin);

          if (isSameOrigin) {
            await client.focus();

            client.postMessage({
              type: "NAVIGATE",
              url: targetUrl,
            });

            return;
          }
        }

        // =========================
        // NO TAB → OPEN NEW
        // =========================
        await clients.openWindow(absoluteUrl);
      } catch (error) {
        console.error("Notification click error:", error);
      }
    })()
  );
});
