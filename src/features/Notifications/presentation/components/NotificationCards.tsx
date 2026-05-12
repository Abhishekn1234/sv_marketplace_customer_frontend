"use client";

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import NotificationHeader from "./NotificationHeader";
import NotificationContent from "./NotificationContent";

import { Bell } from "lucide-react";
import { useLanguage } from "@/features/context/LanguageContext";

import { useNotifications } from "@/features/Notifications/presentation/hooks/useNotifications";
import { useRegisterDeviceToken } from "@/features/Notifications/presentation/hooks/useRegisterDeviceToken";
import { useUnreadCount } from "@/features/Notifications/presentation/hooks/useUnreadCount";
import { useMarkNotificationRead } from "@/features/Notifications/presentation/hooks/useMarkNotificationRead";

import CommonCard from "@/components/common/CommonCards";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";

import { getNotificationTarget } from "../utils/notificationNavigation";
import Select from "@/components/input/Select";
import Button from "@/components/input/Button";

export default function NotificationCards() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [type, setType] = useState<any>(undefined);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    data: apiNotifications = [],
    loading,
    refetch: refetchNotifications,
  } = useNotifications({ page, limit, type });

  const { refetch: refetchUnreadCount } = useUnreadCount();
  const { markAsRead } = useMarkNotificationRead();

  const { fcmNotifications = [] } = useRegisterDeviceToken();

  useEffect(() => {
    setPage(1);
  }, [type, limit]);

  // ========================
  // NORMALIZE DATA
  // ========================
  const normalizedAPI = useMemo(
    () =>
      apiNotifications.map((n: any) => ({
        ...n,
        id: String(n._id),
        source: "api",
      })),
    [apiNotifications]
  );

  const normalizedFCM = useMemo(
    () =>
      page === 1
        ? fcmNotifications.map((msg: any) => ({
            id: msg._id || msg.id,
            title: msg.title,
            message: msg.message,
            isRead: false,
            createdAt: msg.createdAt,
            source: "fcm",
          }))
        : [],
    [fcmNotifications, page]
  );

  // ========================
  // FINAL NOTIFICATIONS
  // ========================
  const notifications = useMemo(
    () => [...normalizedFCM, ...normalizedAPI],
    [normalizedFCM, normalizedAPI]
  );

  // ========================
  // UNREAD ONLY
  // ========================
  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.isRead),
    [notifications]
  );

  // ========================
  // SELECT SINGLE
  // ========================
  const toggleSelect = (id: string) => {
    const target = notifications.find((n) => n.id === id);
    if (!target || target.isRead) return; // block read

    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  // ========================
  // SELECT ALL (UNREAD ONLY)
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
  // MARK SELECTED AS READ
  // ========================
  const markSelectedAsRead = async () => {
    try {
      if (selected.length === 0) return;

      await Promise.all(selected.map((id) => markAsRead(id)));

      setSelected([]);
      refetchNotifications();
      refetchUnreadCount();
    } catch (err) {
      console.error(err);
    }
  };

  // ========================
  // MARK ALL AS READ
  // ========================
  const markAllAsReadSafe = async () => {
    try {
      await Promise.all(notifications.map((n) => markAsRead(n.id)));

      setSelected([]);
      refetchNotifications();
      refetchUnreadCount();
    } catch (err) {
      console.error(err);
    }
  };

  // ========================
  // NAVIGATION
  // ========================
  const handleNotificationClick = (notification: any) => {
    const target = getNotificationTarget(notification);
    if (target) navigate(target);
  };

  // ========================
  // PAGINATION
  // ========================
  const hasNextPage = apiNotifications.length === limit;
  const hasPrevPage = page > 1;

  return (
    <div className="min-h-screen">
      <div className="w-full px-4 py-6">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <Bell className="text-blue-600 w-6 h-6" />
          <h1 className="text-xl font-semibold">
            {t.notificationpage.title}
          </h1>
        </div>

        <CommonCard className="max-w-5xl mx-auto flex flex-col min-h-[520px]">

          {/* FILTER BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">

            <Select
              options={[
                { label: "5 / page", value: "5" },
                { label: "10 / page", value: "10" },
                { label: "20 / page", value: "20" },
                { label: "50 / page", value: "50" },
              ]}
              value={limit.toString()}
              onChange={(val) => setLimit(Number(val))}
              className="w-full sm:w-[140px]"
            />

            <div className="flex flex-wrap gap-2 sm:justify-end">
              {[
                { label: t.notificationpage.filters.All, value: undefined },
                { label: t.notificationpage.filters.Requested, value: "BOOKING_REQUEST" },
                { label: t.notificationpage.filters.Updates, value: "BOOKING_UPDATE" },
                { label: t.notificationpage.filters.Admin, value: "ADMIN_MESSAGE" },
              ].map((f, i) => (
                <Button
                  key={i}
                  onClick={() => setType(f.value)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    type === f.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </div>

          {/* HEADER */}
          <NotificationHeader
            toggleSelectAll={toggleSelectAll}
            selected={selected}
            total={unreadNotifications.length}
            markAllAsRead={markAllAsReadSafe}
            markSelectedAsRead={markSelectedAsRead}
          />

          {/* BODY */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <CommonSpinner />
              </div>
            ) : (
              <>
                <NotificationContent
                  notifications={notifications}
                  selected={selected}
                  toggleSelect={toggleSelect}
                  onNotificationClick={handleNotificationClick}
                />

                {/* PAGINATION */}
                <div className="flex justify-end items-center gap-3 p-4 border-t">
                  <Button
                    disabled={!hasPrevPage}
                    onClick={() => setPage((p) => p - 1)}
                    className={`px-4 py-2 ${
                      hasPrevPage ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    Previous
                  </Button>

                  <span className="text-sm">Page {page}</span>

                  <Button
                    disabled={!hasNextPage}
                    onClick={() => setPage((p) => p + 1)}
                    className={`px-4 py-2 ${
                      hasNextPage ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </div>

        </CommonCard>
      </div>
    </div>
  );
}