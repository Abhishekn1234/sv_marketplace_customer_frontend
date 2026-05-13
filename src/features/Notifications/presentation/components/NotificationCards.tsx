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
import { toast } from "react-toastify";

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
  const url = getNotificationTarget(notification);

  if (typeof url !== "string") {
    toast.error("Booking not found or already finished");
    return;
  }

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
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {t.notificationpage.title}
          </h1>
          </div>
        </div>

        <CommonCard className="overflow-hidden border-none shadow-xl shadow-gray-200/50 flex flex-col min-h-[600px] p-0 sm:p-0">
          {/* FILTER BAR */}
          <div className="px-4 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ">
            <Select
              options={[
                { label: "5 per page", value: "5" },
                { label: "10 per page", value: "10" },
                { label: "20 per page", value: "20" },
                { label: "50 per page", value: "50" },
              ]}
              value={limit.toString()}
              onChange={(val) => setLimit(Number(val))}
              className="w-full sm:w-[160px] text-sm font-medium"
            />
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
              {[
                { label: t.notificationpage.filters.All, value: undefined },
                { label: t.notificationpage.filters.Requested, value: "BOOKING_REQUEST" },
                { label: t.notificationpage.filters.Updates, value: "BOOKING_UPDATE" },
                { label: t.notificationpage.filters.Admin, value: "ADMIN_MESSAGE" },
              ].map((f) => (
                <Button
                  key={f.label}
                  onClick={() => setType(f.value)}
                  className={`px-4 py-1.5 text-sm rounded-full whitespace-nowrap transition-all font-medium ${
                    type === f.value
                      ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-blue-400 hover:bg-blue-50/50"
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
            total={unreadNotifications.length}
            markAllAsRead={markAllAsReadSafe}
            markSelectedAsRead={markSelectedAsRead}
          />
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
                <div className="flex justify-between items-center gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                  <span className="text-sm font-medium text-gray-500">
                    Page <span className="text-gray-900">{page}</span>
                  </span>
                  <div className="flex items-center gap-2">
                  <Button
                      variant="secondary"
                    disabled={!hasPrevPage}
                    onClick={() => setPage((p) => p - 1)}
                      className="px-5 py-2 text-sm font-semibold rounded-xl"
                  >
                    Previous
                  </Button>
                  <Button
                      variant="primary"
                    disabled={!hasNextPage}
                    onClick={() => setPage((p) => p + 1)}
                      className="px-5 py-2 text-sm font-semibold rounded-xl"
                  >
                    Next
                  </Button>
                </div>
                </div>
              </>
            )}
          </div>
        </CommonCard>
      </div>
    </div>
  );
}