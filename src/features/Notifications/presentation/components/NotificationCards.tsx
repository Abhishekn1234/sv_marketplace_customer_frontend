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


import { useAuthStore } from "@/features/core/store/auth";
import { formatNotificationForPanel } from "../utils/notificationcardshelpers";
import { useNotificationFilters } from "../utils/notificationfilterskeylanguages";

export default function NotificationCards() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [type, setType] = useState<any>(undefined);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const filters = useMemo(() => ({ page, type }), [page, type]);
 const FILTERS=useNotificationFilters();
  const { data, isLoading, isFetching } = useNotifications(filters);

  const notifications = useAuthStore((state) => state.notifications.list);
  const setNotificationsList = useAuthStore((state) => state.setNotificationsList);
  const markNotificationRead = useAuthStore((state) => state.markNotificationRead);

  const { markAsRead } = useMarkNotificationRead();
  const { markAllAsRead } = useMarkAllAsRead();

  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      setNotificationsList(
        data.data.map((n: any) => ({
          ...formatNotificationForPanel(n),
          id: n._id || n.id || n.messageId,
          isRead: !!n.isRead,
          source: "api",
        }))
      );
    }
  }, [data, setNotificationsList]);

  const localNotifications = useMemo(() => notifications, [notifications]);
  const unreadNotifications = useMemo(
    () => localNotifications.filter((n) => !n.isRead),
    [localNotifications]
  );

  const toggleSelect = (id: string) => {
    if (!id) return;
    const target = localNotifications.find((n) => n.id === id);
    if (!target || target.isRead) return;
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const unreadIds = localNotifications
      .filter((n) => !n.isRead)
      .map((n) => n.id)
      .filter((id): id is string => typeof id === "string");

    const allSelected =
      unreadIds.length > 0 && unreadIds.every((id) => selected.includes(id));

    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !unreadIds.includes(id)));
    } else {
      setSelected(unreadIds);
    }
  };

  const markSelectedAsRead = async () => {
    if (!selected.length) return;
    await Promise.all(selected.map(markAsRead));
    selected.forEach((id) => markNotificationRead(id));
    setSelected([]);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    notifications.forEach((n) => {
      if (typeof n.id === "string") markNotificationRead(n.id);
    });
    setSelected([]);
  };

  const handleNotificationClick = (notification: any) => {
    const url = getNotificationTarget(notification);
    if (typeof url !== "string") {
      toast.error("Booking not found");
      return;
    }
    markNotificationRead(notification.id);
    navigate(url);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && (data?.data?.length ?? 0) > 0) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [data]);


  return (
    <div className="w-full">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm shadow-blue-200">
          <Bell className="text-white w-4.5 h-4.5" />
        </div>
        <h1 className="text-[17px] sm:text-lg font-semibold text-gray-800">
          {t.notificationpage.title}
        </h1>
        {unreadNotifications.length > 0 && (
          <span className="text-[11px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {unreadNotifications.length}
          </span>
        )}
      </div>

      {/* Card */}
      <CommonCard className="p-0 overflow-hidden rounded-2xl border border-gray-200/80 shadow-sm">

        {/* Filter bar */}
        <div className="px-4 sm:px-5 py-3 border-b border-gray-100/80 bg-gray-50/60">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {FILTERS.map((f) => {
              const isActive = type === f.value;
              return (
                <Button
                  key={f.label}
                  onClick={() => {
                    setType(f.value);
                    setPage(1);
                  }}
                  variant={isActive ? "default" : "ghost"}
                  className={`
                    px-4 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all
                    ${isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                      : "text-gray-500 hover:text-gray-700 hover:bg-white hover:shadow-sm"}
                  `}
                >
                  {f.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Sticky actions header */}
        <NotificationHeader
          toggleSelectAll={toggleSelectAll}
          selected={selected}
          total={unreadNotifications.length}
          markAllAsRead={handleMarkAllAsRead}
          markSelectedAsRead={markSelectedAsRead}
        />

        {/* Scrollable list */}
        <div className="h-[calc(100dvh-18.5rem)] sm:h-[calc(100dvh-20rem)] overflow-y-auto bg-white">
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

          {/* Infinite scroll sentinel */}
          <div ref={loaderRef} className="flex justify-center py-5">
            {isFetching && <CommonSpinner />}
          </div>
        </div>

      </CommonCard>
    </div>
  );
}