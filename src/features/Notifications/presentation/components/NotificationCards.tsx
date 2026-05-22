"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import NotificationHeader from "./NotificationHeader";
import NotificationContent from "./NotificationContent";

import { Bell } from "lucide-react";
import { useLanguage } from "@/features/context/LanguageContext";

import { useNotifications } from "@/features/Notifications/presentation/hooks/useNotifications";
import { useMarkNotificationRead } from "@/features/Notifications/presentation/hooks/useMarkNotificationRead";
import { useMarkAllAsRead } from "../hooks/useMarkAllAsRead";

import CommonCard from "@/components/common/CommonCards";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import { Button } from "@/components/ui/button";

import { getNotificationTarget } from "../utils/notificationNavigation";
import { toast } from "react-toastify";

// ✅ ZUSTAND STORE
import { useAuthStore } from "@/features/core/store/auth";

// =========================
// HELPERS
// =========================
const getFirstString = (...values: unknown[]) =>
  values.find(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0
  );

const isChatNotification = (notification: any) => {
  const data =
    notification.data ||
    notification.payload ||
    notification.metadata ||
    {};

  const senderType =
    notification.senderType ||
    notification.sender ||
    data.senderType ||
    data.sender;

  return (
    notification.type === "CHAT_MESSAGE" ||
    notification.type === "NEW_MESSAGE" ||
    senderType === "WORKER" ||
    senderType === "worker"
  );
};

const getWorkerName = (notification: any) => {
  const data =
    notification.data ||
    notification.payload ||
    notification.metadata ||
    {};

  return getFirstString(
    notification.workerName,
    notification.senderName,
    notification.senderFullName,
    notification.workerFullName,
    notification.fullName,
    data.workerName,
    data.senderName,
    data.senderFullName,
    data.workerFullName,
    data.fullName
  );
};

const getMessageText = (notification: any) => {
  const data =
    notification.data ||
    notification.payload ||
    notification.metadata ||
    {};

  return (
    getFirstString(
      notification.body,
      notification.message,
      notification.text,
      notification.content,
      data.body,
      data.message,
      data.text,
      data.content
    ) || "New message"
  );
};

const formatNotificationForPanel = (notification: any) => {
  if (!isChatNotification(notification)) return notification;

  const workerName = getWorkerName(notification);

  return {
    ...notification,
    title: workerName
      ? `New chat message from ${workerName}`
      : "New chat message from worker",
    message: getMessageText(notification),
  };
};

// =========================
// COMPONENT
// =========================
export default function NotificationCards() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [type, setType] = useState<any>(undefined);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  // =========================
  // API FETCH (only for hydration)
  // =========================
  const filters = useMemo(
    () => ({ page, type }),
    [page, type]
  );

  const { data, isLoading, isFetching } =
    useNotifications(filters);

  // =========================
  // ZUSTAND STATE (SOURCE OF TRUTH)
  // =========================
  const notifications = useAuthStore(
    (state) => state.notifications.list
  );

  const setNotificationsList = useAuthStore(
    (state) => state.setNotificationsList
  );

  const markNotificationRead = useAuthStore(
    (state) => state.markNotificationRead
  );

  const { markAsRead } = useMarkNotificationRead();
  const { markAllAsRead } = useMarkAllAsRead();

  // =========================
  // HYDRATE ZUSTAND FROM API
  // =========================
  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
     setNotificationsList(
  data.data.map((n: any) => ({
    ...formatNotificationForPanel(n),
    id: n._id || n.id || n.messageId, // ✅ FIX
    isRead: !!n.isRead,
    source: "api",
  }))
);
    }
  }, [data, setNotificationsList]);

  // =========================
  // DERIVED DATA
  // =========================
  const localNotifications = useMemo(
    () => notifications,
    [notifications]
  );

  const unreadNotifications = useMemo(
    () => localNotifications.filter((n) => !n.isRead),
    [localNotifications]
  );

  // =========================
  // SELECT
  // =========================
 const toggleSelect = (id: string) => {
  if (!id) return;

  const target = localNotifications.find((n) => n.id === id);
  if (!target || target.isRead) return;

  setSelected((prev) =>
    prev.includes(id)
      ? prev.filter((x) => x !== id)
      : [...prev, id]
  );
};

  const toggleSelectAll = () => {
  const unreadIds = localNotifications
    .filter((n) => !n.isRead)
    .map((n) => n.id)
    .filter((id): id is string => typeof id === "string"); // ✅ FIX TYPE GUARD

  const allSelected =
    unreadIds.length > 0 &&
    unreadIds.every((id) => selected.includes(id));

  if (allSelected) {
    setSelected((prev) =>
      prev.filter((id) => !unreadIds.includes(id))
    );
  } else {
    setSelected(unreadIds);
  }
};

  // =========================
  // MARK AS READ
  // =========================
  const markSelectedAsRead = async () => {
    if (!selected.length) return;

    await Promise.all(selected.map(markAsRead));

    selected.forEach((id) => {
      markNotificationRead(id);
    });

    setSelected([]);
  };

 const handleMarkAllAsRead = async () => {
  await markAllAsRead();

  notifications.forEach((n) => {
    if (typeof n.id === "string") {
      markNotificationRead(n.id);
    }
  });

  setSelected([]);
};

  // =========================
  // CLICK HANDLER
  // =========================
  const handleNotificationClick = (notification: any) => {
    const url = getNotificationTarget(notification);

    if (typeof url !== "string") {
      toast.error("Booking not found");
      return;
    }

    markNotificationRead(notification.id);

    navigate(url);
  };

  // =========================
  // INFINITE SCROLL
  // =========================
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (target.isIntersecting && (data?.data?.length ?? 0) > 0) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [data]);

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-600 rounded-xl">
            <Bell className="text-white" />
          </div>
          <h1 className="text-xl font-bold">
            {t.notificationpage.title}
          </h1>
        </div>

        <CommonCard className="min-h-[600px] p-0">

          {/* FILTER */}
          <div className="p-4 flex justify-between">
            <div className="flex gap-2">
              {[
                { label: "All", value: undefined },
                { label: "Requested", value: "BOOKING_REQUEST" },
                { label: "Updates", value: "BOOKING_UPDATE" },
                { label: "Admin", value: "ADMIN_MESSAGE" },
              ].map((f) => (
                <Button
                  key={f.label}
                  onClick={() => {
                    setType(f.value);
                    setPage(1);
                  }}
                  className={
                    type === f.value
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : ""
                  }
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </div>

          {/* HEADER ACTIONS */}
          <NotificationHeader
             toggleSelectAll={toggleSelectAll}
              selected={selected}
              total={unreadNotifications.length}
            markAllAsRead={handleMarkAllAsRead}
            markSelectedAsRead={markSelectedAsRead}
          />

          {/* LIST */}
          <div className="overflow-y-auto">
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <CommonSpinner />
              </div>
            ) : (
              <NotificationContent
                notifications={localNotifications}
                selected={selected}
                toggleSelect={toggleSelect}
                onNotificationClick={handleNotificationClick}
              />
            )}

            {/* LOADER */}
            <div ref={loaderRef} className="flex justify-center py-4">
              {isFetching && <CommonSpinner />}
            </div>
          </div>

        </CommonCard>
      </div>
    </div>
  );
}