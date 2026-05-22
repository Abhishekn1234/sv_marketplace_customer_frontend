import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/core/store/auth";

type NotificationItem = {
  _id?: string;
  id?: string;
  title: string;
  message: string;
  isRead: boolean;
};

export function useNotificationManager() {
  const navigate = useNavigate();

  const { pushNotification, incrementUnread } = useAuthStore();

  const lastNotificationId = useRef<string | null>(null);

  // -------------------------------
  // 1. Browser Notification
  // -------------------------------
  const showBrowserNotification = useCallback(
    (n: NotificationItem) => {
      if (!("Notification" in window)) return;

      if (Notification.permission !== "granted") return;

      const notif = new Notification(n.title, {
        body: n.message,
        icon: "/icon.png",
      });

      notif.onclick = () => {
        window.focus();
        navigate("/notifications");
      };
    },
    [navigate]
  );

  // -------------------------------
  // 2. Handle Incoming Notification
  // -------------------------------
  const handleIncomingNotification = useCallback(
    (notification: NotificationItem) => {
      const id = notification._id || notification.id;

      // prevent duplicate notifications
      if (id && lastNotificationId.current === id) return;
      lastNotificationId.current = id || null;

      // update zustand store
      pushNotification(notification);

      // update unread count
      if (!notification.isRead) {
        incrementUnread();
      }

      // show browser push notification
      showBrowserNotification(notification);
    },
    [pushNotification, incrementUnread, showBrowserNotification]
  );

  // -------------------------------
  // 3. Permission Request (IMPORTANT)
  // -------------------------------
  useEffect(() => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // -------------------------------
  // 4. Socket / FCM listener
  // -------------------------------
  useEffect(() => {
    // 🔌 SOCKET EXAMPLE
    // socket.on("notification", handleIncomingNotification);

    // 🔥 FCM EXAMPLE
    // onMessage(messaging, (payload) => {
    //   handleIncomingNotification({
    //     id: payload.messageId,
    //     title: payload.notification?.title || "New Notification",
    //     message: payload.notification?.body || "",
    //     isRead: false,
    //   });
    // });

    return () => {
      // socket.off("notification", handleIncomingNotification);
    };
  }, [handleIncomingNotification]);
}