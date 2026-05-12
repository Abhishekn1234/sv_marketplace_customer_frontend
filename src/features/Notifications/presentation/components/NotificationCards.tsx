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

  // ✅ normalize API
  const normalizedAPI = useMemo(
    () =>
      apiNotifications.map((n: any) => ({
        ...n,
        id: String(n._id),
        source: "api",
      })),
    [apiNotifications]
  );

  // ⚠️ show FCM ONLY on first page
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

  // ✅ final merged list
  const notifications = useMemo(
    () => [...normalizedFCM, ...normalizedAPI],
    [normalizedFCM, normalizedAPI]
  );

  // ✅ SELECT ONLY
  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  // ✅ SELECT ALL (current page only)
  const toggleSelectAll = () => {
    const ids = notifications.map((n) => n.id);

    if (selected.length === ids.length) {
      setSelected([]);
    } else {
      setSelected(ids);
    }
  };

  // ✅ READ SELECTED ONLY
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

  // ✅ READ ALL (current dataset)
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

  // ✅ NAVIGATION
  const handleNotificationClick = (notification: any) => {
    const target = getNotificationTarget(notification);
    if (target) navigate(target);
  };

  // ========================
  // ✅ PAGINATION LOGIC FIX
  // ========================

  const hasNextPage = apiNotifications.length === limit;
  const hasPrevPage = page > 1;

  const nextPage = () => {
    if (hasNextPage) setPage((p) => p + 1);
  };

  const prevPage = () => {
    if (hasPrevPage) setPage((p) => p - 1);
  };

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

        {/* CARD */}
        <CommonCard className="max-w-5xl mx-auto flex flex-col min-h-[520px]">
                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">

  {/* LEFT: LIMIT SELECT */}
  <div className="w-full sm:w-auto">
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
  </div>

  {/* RIGHT: FILTER BUTTONS */}
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
        className={`px-3 py-1 text-sm rounded-full transition whitespace-nowrap
          ${
            type === f.value
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
      >
        {f.label}
      </Button>
    ))}

  </div>

</div>
          <NotificationHeader
            toggleSelectAll={toggleSelectAll}
            selected={selected}
            total={notifications.length}
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
                    onClick={prevPage}
                    className={`px-4 py-2 rounded text-sm ${
                      hasPrevPage
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    Previous
                  </Button>

                  <span className="text-sm text-gray-600">
                    Page {page}
                  </span>

                  <Button
                    disabled={!hasNextPage}
                    onClick={nextPage}
                    className={`px-4 py-2 rounded text-sm ${
                      hasNextPage
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-400"
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