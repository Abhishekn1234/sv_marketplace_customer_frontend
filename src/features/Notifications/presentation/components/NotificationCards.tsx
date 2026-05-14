"use client";

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import NotificationHeader from "./NotificationHeader";
import NotificationContent from "./NotificationContent";

import { Bell } from "lucide-react";
import { useLanguage } from "@/features/context/LanguageContext";

import { useNotifications } from "@/features/Notifications/presentation/hooks/useNotifications";
import { useRegisterDeviceToken } from "@/features/Notifications/presentation/hooks/useRegisterDeviceToken";
import { useMarkNotificationRead } from "@/features/Notifications/presentation/hooks/useMarkNotificationRead";

import CommonCard from "@/components/common/CommonCards";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";

import { getNotificationTarget } from "../utils/notificationNavigation";
import Select from "@/components/input/Select";
import Button from "@/components/input/Button";
import { toast } from "react-toastify";

export default function NotificationCards() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [type, setType] = useState<any>(undefined);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const filters = useMemo(() => ({ page, limit, type }), [page, limit, type]);

  const {
    data: apiNotifications = [],
    loading,
  } = useNotifications(filters);

  const { fcmNotifications = [] } = useRegisterDeviceToken();

  // ✅ LOCAL STATE (MAIN FIX)
  const [localNotifications, setLocalNotifications] = useState<any[]>([]);

  // sync API → local only when API changes
  useEffect(() => {
    const normalizedAPI = apiNotifications.map((n: any) => ({
      ...n,
      id: String(n._id),
      source: "api",
    }));

    const normalizedFCM =
      page === 1
        ? fcmNotifications.map((msg: any) => ({
            id: msg._id || msg.id,
            title: msg.title,
            message: msg.message,
            isRead: false,
            createdAt: msg.createdAt,
            source: "fcm",
          }))
        : [];

    setLocalNotifications([...normalizedFCM, ...normalizedAPI]);
  }, [apiNotifications, fcmNotifications, page]);

  // ✅ UNREAD COUNT (FROM LOCAL STATE)
  const unreadNotifications = useMemo(
    () => localNotifications.filter((n) => !n.isRead),
    [localNotifications]
  );

  const { markAsRead } = useMarkNotificationRead();

  // ========================
  // SELECT SINGLE
  // ========================
  const toggleSelect = (id: string) => {
    const target = localNotifications.find((n) => n.id === id);
    if (!target || target.isRead) return;

    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  // ========================
  // SELECT ALL
  // ========================
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

  // ========================
  // MARK SELECTED AS READ (OPTIMISTIC)
  // ========================
  const markSelectedAsRead = async () => {
    try {
      if (selected.length === 0) return;

      await Promise.all(selected.map((id) => markAsRead(id)));

      setLocalNotifications((prev) =>
        prev.map((n) =>
          selected.includes(n.id)
            ? { ...n, isRead: true }
            : n
        )
      );

      setSelected([]);
    } catch (err) {
      console.error(err);
    }
  };

  // ========================
  // MARK ALL AS READ
  // ========================
  const markAllAsReadSafe = async () => {
    try {
      await Promise.all(localNotifications.map((n) => markAsRead(n.id)));

      setLocalNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );

      setSelected([]);
    } catch (err) {
      console.error(err);
    }
  };

  // ========================
  // NAVIGATION
  // ========================
  const handleNotificationClick = (notification: any) => {
    const url = getNotificationTarget(notification);

    if (typeof url !== "string") {
      toast.error("Booking not found or already finished");
      return;
    }

    // 🔥 instantly mark as read
    setLocalNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id
          ? { ...n, isRead: true }
          : n
      )
    );

    navigate(url);
  };

  // ========================
  // PAGINATION
  // ========================
  const hasNextPage = apiNotifications.length === limit;
  const hasPrevPage = page > 1;

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
              <Bell className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t.notificationpage.title}
            </h1>
          </div>
        </div>

        <CommonCard className="min-h-[600px] p-0">

          {/* FILTER */}
          <div className="px-4 py-4 flex justify-between gap-4">
            <Select
              options={[
                { label: "5 per page", value: "5" },
                { label: "10 per page", value: "10" },
                { label: "20 per page", value: "20" },
                { label: "50 per page", value: "50" },
              ]}
              value={limit.toString()}
              onChange={(val) => setLimit(Number(val))}
              className="w-[160px]"
            />

            <div className="flex gap-2">
              {[
                { label: t.notificationpage.filters.All, value: undefined },
                { label: t.notificationpage.filters.Requested, value: "BOOKING_REQUEST" },
                { label: t.notificationpage.filters.Updates, value: "BOOKING_UPDATE" },
                { label: t.notificationpage.filters.Admin, value: "ADMIN_MESSAGE" },
              ].map((f) => (
                <Button
                  key={f.label}
                  onClick={() => setType(f.value)}
                  className={`px-4 py-1 rounded-full ${
                    type === f.value
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600"
                  }`}
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
            markAllAsRead={markAllAsReadSafe}
            markSelectedAsRead={markSelectedAsRead}
          />

          {/* LIST */}
          <div className="overflow-y-auto">
            {loading ? (
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

            {/* PAGINATION */}
            <div className="flex justify-between p-4 border-t">
              <span>Page {page}</span>

              <div className="flex gap-2">
                <Button
                  disabled={!hasPrevPage}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>

                <Button
                  disabled={!hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>

        </CommonCard>
      </div>
    </div>
  );
}