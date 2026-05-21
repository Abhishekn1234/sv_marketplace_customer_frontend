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

import { getNotificationTarget } from "../utils/notificationNavigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

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
  // API FILTERS
  // =========================
  const filters = useMemo(
    () => ({ page, type }),
    [page, type]
  );

  const { data, isLoading, isFetching } =
    useNotifications(filters);

  const apiNotifications = data?.data ?? [];
  const fcmNotifications: any[] = [];

  const [notificationMap, setNotificationMap] = useState<
    Record<string, any>
  >({});

  // =========================
  // MERGE DATA
  // =========================
useEffect(() => {
  let changed = false;

  setNotificationMap((prev) => {
    const updated = { ...prev };

    apiNotifications.forEach((n: any) => {
      const id = n._id;

      const formatted = formatNotificationForPanel(n);

      const existing = updated[id];

      // 🔥 ONLY update if changed
      if (!existing || existing.updatedAt !== n.updatedAt) {
        updated[id] = {
          ...formatted,
          id: String(id),
          source: "api",
        };

        changed = true;
      }
    });

    if (page === 1 && fcmNotifications.length > 0) {
      fcmNotifications.forEach((msg: any) => {
        const id = msg._id || msg.id;

        if (!updated[id]) {
          updated[id] = {
            id,
            title: msg.title,
            message: msg.message,
            isRead: false,
            createdAt: msg.createdAt,
            source: "fcm",
          };

          changed = true;
        }
      });
    }

    return changed ? updated : prev;
  });
}, [apiNotifications, page]);

  const localNotifications = useMemo(
    () => Object.values(notificationMap),
    [notificationMap]
  );

  const unreadNotifications = useMemo(
    () => localNotifications.filter((n) => !n.isRead),
    [localNotifications]
  );

  const { markAsRead } = useMarkNotificationRead();
  const { markAllAsRead } = useMarkAllAsRead();

  // =========================
  // SELECT
  // =========================
  const toggleSelect = (id: string) => {
    const target = notificationMap[id];
    if (!target || target.isRead) return;

    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const unreadIds = unreadNotifications.map((n) => n.id);

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

    setNotificationMap((prev) => {
      const updated = { ...prev };
      selected.forEach((id) => {
        if (updated[id]) updated[id].isRead = true;
      });
      return updated;
    });

    setSelected([]);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();

    setNotificationMap((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((id) => {
        updated[id].isRead = true;
      });
      return updated;
    });

    setSelected([]);
  };

  const handleNotificationClick = (notification: any) => {
    const url = getNotificationTarget(notification);

    if (typeof url !== "string") {
      toast.error("Booking not found");
      return;
    }

    setNotificationMap((prev) => ({
      ...prev,
      [notification.id]: {
        ...prev[notification.id],
        isRead: true,
      },
    }));

    navigate(url);
  };

  // =========================
  // INFINITE SCROLL
  // =========================
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (
          target.isIntersecting &&
          apiNotifications.length > 0
        ) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [apiNotifications]);

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
                    setNotificationMap({});
                  }}
                  className={
                    type === f.value
                      ? "bg-blue-600 text-white hover:bg-red-600 cursor-pointer"
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
            <div
              ref={loaderRef}
              className="flex justify-center py-4"
            >
              {isFetching && <CommonSpinner />}
            </div>

          </div>

        </CommonCard>
      </div>
    </div>
  );
}