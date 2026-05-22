import { useEffect, useRef } from "react";
import { useAuthStore } from "@/features/core/store/auth";

const getId = (n: any) => n?._id || n?.id || n?.messageId;

const buildRoute = (n: any) => {
  if (n.url) return n.url;

  if (n.type === "ADMIN_MESSAGE") return "/notifications";
  if (n.bookingId) return `/bookings/${n.bookingId}`;

  return "/notifications";
};

const getTitle = (n: any) => {
  if (n.type === "ADMIN_MESSAGE") return "Admin Message";
  return n.title || "Notification";
};

const getBody = (n: any) => {
  if (n.type === "ADMIN_MESSAGE") {
    return n.message || n.body || "You received a new admin message";
  }

  return n.message || n.body || n.text || "New notification";
};

const normalizePath = (path: string) => {
  try {
    return new URL(path, window.location.origin).pathname;
  } catch {
    return path;
  }
};

export const useBrowserNotifications = () => {
  const notifications = useAuthStore((state) => state.notifications.list);

  const seenIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const currentPath = normalizePath(window.location.pathname);

    navigator.serviceWorker.ready.then((reg) => {
      notifications.forEach((n: any) => {
        const id = getId(n);
        if (!id) return;

        // ❌ skip duplicates
        if (seenIds.current.has(id)) return;
        seenIds.current.add(id);

        // ✅ only ADMIN messages
        if (n.type !== "ADMIN_MESSAGE") return;

        const url = buildRoute(n);
        const targetPath = normalizePath(url);

        // ❌ don't notify if user already on same page
        const isSamePage = currentPath === targetPath;

        // ❌ don't notify if user already inside same booking context
        const isInsideBooking =
          currentPath.startsWith("/bookings/") &&
          targetPath.startsWith("/bookings/");

        if (isSamePage || isInsideBooking) return;

        const title = getTitle(n);
        const body = getBody(n);

        reg.showNotification(title, {
          body,
          icon: "/logo.png",
          badge: "/logo.png",
          tag: id,
          data: {
            url,
            type: n.type,
            bookingId: n.bookingId,
          },
          actions: [{ action: "open", title: "Open" }],
        } as NotificationOptions);
      });
    });
  }, [notifications]);
};