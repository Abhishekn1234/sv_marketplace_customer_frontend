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

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

const toClientUrl = (url) => {
  try {
    return new URL(url || "/notifications", self.location.origin).href;
  } catch (_) {
    return new URL("/notifications", self.location.origin).href;
  }
};

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

const buildNotificationRoute = (data) => {
  if (data.url) return data.url;

  const bookingId =
    getId(data.bookingId) ||
    getId(data.booking) ||
    getId(data.booking_id);

  const senderType = data.senderType || data.sender;

  if (
    (senderType === "WORKER" ||
      senderType === "worker" ||
      data.type === "CHAT_MESSAGE") &&
    bookingId
    
  ) {
    return `/message/${bookingId}`;
  }

  if ((data.type === "BOOKING_UPDATE" || data.type === "JOB_TRACKING") && bookingId) {
    return `/jobtracking/${bookingId}`;
  }

  if (data.type === "JOB_PROGRESS" && bookingId) {
    return `/jobprogress/${bookingId}`;
  }

  if (data.type === "BOOKING_CREATED" && data.serviceId && data.serviceTierId) {
    return `/bookingdetail/${data.serviceId}/${data.serviceTierId}`;
  }

  if (data.type === "VIDEO_CALL" && data.senderId) {
    return `/video-call/${data.senderId}`;
  }
  if(data.type==="ADMIN_MESSAGE"){
    return '/notifications';
  }

  return "/notifications";
};

const isChatNotification = (data) => {
  const senderType = data.senderType || data.sender;

  return (
    data.type === "CHAT_MESSAGE" ||
    senderType === "WORKER" ||
    senderType === "worker"
  );
};

const getMessageText = (data) =>
  data.body ||
  data.message ||
  data.text ||
  data.content ||
  "New message";

const getWorkerName = (data) =>
  data.workerName ||
  data.senderName ||
  data.senderFullName ||
  data.workerFullName ||
  data.fullName ||
  "Worker";

const getTitleByType = (type) => {
  switch (type) {
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
      return "Incoming Call";

    default:
      return "Notification";
  }
};

const buildNotificationDisplay = (data) => {
  if (isChatNotification(data)) {
    return {
      title: getWorkerName(data),
      body: getMessageText(data),
    };
  }

  return {
    title: data.title || getTitleByType(data.type),
    body: getMessageText(data),
  };
};

const getNotificationTag = (data) =>
  data.notificationId ||
  data.messageId ||
  data._id ||
  `${buildNotificationRoute(data)}-${getMessageText(data)}`;

const closeAutoFirebaseNotifications = async (payload, display, tag) => {
  const autoTitle = payload.notification?.title;
  const autoBody = payload.notification?.body;

  if (!autoTitle && !autoBody) return;

  const notifications = await self.registration.getNotifications();

  notifications.forEach((notification) => {
    const isWantedNotification =
      notification.tag === tag ||
      (notification.title === display.title &&
        notification.body === display.body);

    const isAutoFirebaseNotification =
      (autoTitle && notification.title === autoTitle) ||
      (autoBody && notification.body === autoBody);

    if (!isWantedNotification && isAutoFirebaseNotification) {
      notification.close();
    }
  });
};

messaging.onBackgroundMessage(async (payload) => {
  const data = payload.data || {};

  const bookingId = data.bookingId;
  const senderType = data.senderType;
  const url = buildNotificationRoute(data);
  const display = buildNotificationDisplay(data);
  
  const tag = getNotificationTag(data);

  const id = tag;

  if (id && shown.has(id)) return;
  if (id) shown.add(id);

  await self.registration.showNotification(display.title, {
    body: display.body,
    icon: "/logo.png",
    badge: "/logo.png",
    tag,
    renotify: true,
    actions: [{ action: "open", title: "Open" }],
    data: {
      url,
      bookingId,
      senderType,
    },
  });

  await closeAutoFirebaseNotifications(payload, display, tag);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/notifications";
  const targetUrl = toClientUrl(url);

  event.waitUntil(
    (async () => {
      if (event.action && event.action !== "open") return;

      const clientsList = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of clientsList) {
        client.postMessage({ type: "NAVIGATE", url });
        await client.focus();
        return;
      }

      await clients.openWindow(targetUrl);
    })()
  );
});
