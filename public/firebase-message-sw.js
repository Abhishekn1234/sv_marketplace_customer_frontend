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

/* =========================
   BACKGROUND PUSH HANDLER
========================= */
messaging.onBackgroundMessage(async (payload) => {
  console.log("🔥 Background message FULL:", payload);

  const data = payload.data || {};
  const notification = payload.notification || {};
  const title =
    data.title ||
    notification.title ||
    "New Notification";

  const body =
    data.body ||
    notification.body ||
    "You have a new update";

  // Helper to pick id-like values
  const getId = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value._id || value.id || "";
  };

  // Build a safe route similar to client-side buildNotificationUrl
  const buildRoute = (d) => {
    if (!d) return "/notifications";

    if (d.url) return d.url;

    const bookingId =
      getId(d.bookingId) || getId(d.booking) || getId(d.booking_id);

    const type = (d.type || "").toUpperCase();
    switch (type) {
      case "CHAT_MESSAGE":
        return bookingId ? `/message/${bookingId}` : "/notifications";
      case "ADMIN_MESSAGE":
        return "/notifications";
      case "BOOKING_CREATED":
        return d.serviceId && d.serviceTierId
          ? `/bookingdetail/${d.serviceId}/${d.serviceTierId}`
          : "/notifications";
      case "BOOKING_REQUEST":
        return bookingId ? `/jobtracking/${bookingId}` : "/notifications";
      case "JOB_TRACKING":
      case "BOOKING_UPDATE":
        return bookingId ? `/jobtracking/${bookingId}` : "/notifications";
      case "JOB_PROGRESS":
        return bookingId ? `/jobprogress/${bookingId}` : "/notifications";
      case "VIDEO_CALL":
        return d.senderId ? `/video-call/${d.senderId}` : "/notifications";
      default:
        return "/notifications";
    }
  };

  const url = buildRoute(data);

  // If any open client is already at the target path, skip showing notification
  try {
    const clientsList = await clients.matchAll({ type: "window", includeUncontrolled: true });

    const targetPath = new URL(url, self.location.origin).pathname;
    const type = (data.type || "").toUpperCase();

    const hasClientAtTarget = clientsList.some((c) => {
      try {
        const p = new URL(c.url).pathname;
        return p === targetPath;
      } catch (e) {
        return false;
      }
    });

    // Only skip if it's NOT an admin message and the client is focused/active
    // For ADMIN_MESSAGE, we always want to show it if the app is closed or backgrounded.
    const isChatOrAdmin = type === "CHAT_MESSAGE" || type === "ADMIN_MESSAGE";
    if (hasClientAtTarget && !isChatOrAdmin) {
      console.log("SW: skipping non-critical notification because client is at target", targetPath);
      return;
    }
  } catch (err) {
    // If clients API fails for any reason, fall back to showing notification
    console.error("SW client check failed:", err);
  }

  await self.registration.showNotification(title, {
    body,
    icon: "/logo.png",
    badge: "/logo.png",
    requireInteraction: (data.type || "").toUpperCase() === "ADMIN_MESSAGE",
    tag: data.messageId || data._id || `admin-${Date.now()}`,
    renotify: true,
    data: {
      url,
    },
  });
});

/* =========================
   CLICK HANDLER
========================= */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/notifications";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) {
          client.focus();
          return;
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});