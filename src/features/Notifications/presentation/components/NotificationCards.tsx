"use client";

import { useState, useEffect } from "react";
import NotificationHeader from "./NotificationHeader";
import NotificationContent from "./NotificationContent";
import { Bell } from "lucide-react";
import { useLanguage } from "@/features/context/LanguageContext";
import { useNotifications } from "@/features/Notifications/presentation/hooks/useNotifications";
import { useRegisterDeviceToken } from "@/features/Notifications/presentation/hooks/useRegisterDeviceToken";
import { useUnreadCount } from "@/features/Notifications/presentation/hooks/useUnreadCount";
import { useMarkAllAsRead } from "@/features/Notifications/presentation/hooks/useMarkAllAsRead";
import { useMarkNotificationRead } from "@/features/Notifications/presentation/hooks/useMarkNotificationRead";
import CommonCard from "@/components/common/CommonCards";
import Button from "@/components/input/Button";
import type { SelectOption } from "@/components/input/Select";
import Select from "@/components/input/Select";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";

export default function NotificationCards() {
  const { t } = useLanguage();

  const [type, setType] = useState<any>(undefined);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    data: apiNotifications = [],
    loading,
    refetch: refetchNotifications,
  } = useNotifications({
    page,
    limit,
    type,
    unreadOnly: false,
  });

  const { count: unreadCount, refetch: refetchUnreadCount } =
    useUnreadCount();

  const { markAllAsRead } = useMarkAllAsRead();
  const { markAsRead } = useMarkNotificationRead();
  const { fcmNotifications = [] } = useRegisterDeviceToken();

  useEffect(() => {
    setPage(1);
  }, [type, limit]);

  const normalizedFCM = fcmNotifications.map((msg: any) => ({
    id: msg._id,
    title: msg.title,
    message: msg.message,
    type: "ADMIN_MESSAGE",
    isRead: false,
    createdAt: msg.createdAt,
  }));

  const normalizedAPI = apiNotifications.map((n: any) => ({
    ...n,
    id: String(n._id),
  }));

  const notifications =
    page === 1
      ? [...normalizedFCM, ...normalizedAPI]
      : normalizedAPI;

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === notifications.length) {
      setSelected([]);
    } else {
      setSelected(notifications.map((n) => n.id));
    }
  };

  // ✅ BULK READ USING YOUR HOOK
  const markSelectedAsRead = async () => {
    try {
      await Promise.all(selected.map(markAsRead));
      setSelected([]);
      refetchNotifications();
      refetchUnreadCount();
    } catch (err) {
      console.error(err);
    }
  };
 const limitOptions: SelectOption[] = [5, 10, 20, 25].map((l) => ({
  label: `${l} / page`,
  value: l.toString(), // Select works with string values
}));
  const deleteSelected = async () => {
    console.log("Deleting:", selected); // replace with API
    setSelected([]);
    refetchNotifications();
  };
  const hasData = notifications.length > 0;

  return (
  <div className="min-h-screen ">
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-xl shadow-sm">
          <Bell className="text-blue-600 w-6 h-6" />
        </div>

        <h1 className="text-xl font-semibold text-gray-800">
          {t.notificationpage.title}
        </h1>
      </div>

      {/* Filters */}
    {hasData && (
  <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
    {[
      { label: "All", value: undefined },
      { label: "Requests", value: "BOOKING_REQUEST" },
      { label: "Updates", value: "BOOKING_UPDATE" },
      { label: "Admin", value: "ADMIN_MESSAGE" },
    ].map((f, i) => (
      <Button
        key={i}
        onClick={() => setType(f.value)}
        className={`px-4 py-2 text-sm rounded-full transition whitespace-nowrap ${
          type === f.value
            ? "bg-blue-600 text-white shadow"
            : "bg-white border hover:bg-gray-50 text-gray-600"
        }`}
      >
        {f.label}
      </Button>
    ))}
  </div>
)}

      {hasData &&(
          <div className="flex justify-end mb-3">
                <Select
          options={limitOptions}
          value={limit.toString()}
          onChange={(val) => setLimit(Number(val))}
          className="w-auto min-w-[120px]"
        />
      </div>
      )}
    

      {/* Card */}
      <CommonCard className="w-full max-w-5xl mx-auto flex flex-col min-h-[520px] rounded-2xl shadow-lg border border-gray-100 bg-white">

        <NotificationHeader
          toggleSelectAll={toggleSelectAll}
          selected={selected}
          total={notifications.length}
          markAllAsRead={async () => {
            await markAllAsRead();
            refetchUnreadCount();
            refetchNotifications();
          }}
          markSelectedAsRead={markSelectedAsRead}
          deleteSelected={deleteSelected}
          unreadCount={unreadCount}
        />

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <CommonSpinner size={30} />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-gray-500">
              {t.notificationpage.noNotifications}
            </div>
          ) : (
            
            <>
            <NotificationContent
              notifications={notifications}
              selected={selected}
              toggleSelect={toggleSelect}
            />
             <div className="flex justify-end items-center gap-3 p-4   rounded-b-2xl">
          <Button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`px-4 py-2 rounded text-sm transition ${
              page === 1
                ? "bg-gray-100 text-gray-400"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </Button>

          <span className="text-sm text-gray-600">
            Page {page}
          </span>

          <Button
            disabled={apiNotifications.length < limit}
            onClick={() => setPage((p) => p + 1)}
            className={`px-4 py-2 rounded text-sm transition ${
              apiNotifications.length < limit
                ? "bg-gray-100 text-gray-400"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </Button>
        </div>
            </>
            
          )}
        </div>

        {/* Pagination */}
       

      </CommonCard>
    </div>
  </div>
);
}