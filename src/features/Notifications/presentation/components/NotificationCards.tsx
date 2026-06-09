"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Bell } from "lucide-react";
import { toast } from "react-toastify";

import { useLanguage } from "@/features/context/LanguageContext";


import NotificationHeader from "./NotificationHeader";
import NotificationContent from "./NotificationContent";

import CommonCard from "@/components/common/CommonCards";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import { Button } from "@/components/ui/button";

import { useNotifications } from "@/features/Notifications/presentation/hooks/useNotifications";
import { useMarkNotificationRead } from "@/features/Notifications/presentation/hooks/useMarkNotificationRead";
import { useMarkAllAsRead } from "../hooks/useMarkAllAsRead";

import { getNotificationTarget } from "../utils/notificationNavigation";
import { useNotificationFilters } from "../utils/notificationfilterskeylanguages";
import { useTheme } from "@/features/context/themeContext";

export default function NotificationCards() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [type, setType] = useState<any>(undefined);
  const [selected, setSelected] = useState<string[]>([]);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const filters = useMemo(() => ({ type, limit: 20 }), [type]);

  const FILTERS = useNotificationFilters();

  // ✅ INFINITE QUERY
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useNotifications(filters);

  // ✅ FLATTEN DATA (ONLY SOURCE OF TRUTH)
  const notifications = useMemo(() => {
    return data?.pages.flatMap((p) => p.data) ?? [];
  }, [data]);

  const unreadNotifications = useMemo(
    () => notifications.filter((n: any) => !n.isRead),
    [notifications]
  );

const { mutateAsync: markAsRead } = useMarkNotificationRead();
  const { markAllAsRead } = useMarkAllAsRead();

  // =========================
  // SELECT LOGIC
  // =========================
  const toggleSelect = (id: string) => {
    const target = notifications.find((n: any) => n.id === id);
    if (!target || target.isRead) return;

    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const unreadIds = unreadNotifications.map((n: any) => n.id);

    const allSelected =
      unreadIds.length > 0 &&
      unreadIds.every((id) => selected.includes(id));

    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !unreadIds.includes(id)));
    } else {
      setSelected(unreadIds);
    }
  };

  // =========================
  // MARK SELECTED
  // =========================
  const markSelectedAsRead = async () => {
    if (!selected.length) return;

await Promise.all(selected.map((id) => markAsRead(id)));
    setSelected([]);
  };

  // =========================
  // MARK ALL
  // =========================
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setSelected([]);
  };

  // =========================
  // CLICK NAVIGATION
  // =========================
  const handleNotificationClick = (notification: any) => {
    const url = getNotificationTarget(notification);

    if (typeof url !== "string") {
      toast.error("Booking not found");
      return;
    }

  const notificationId = notification.id || notification._id;

if (notificationId) {
  markAsRead(notificationId);
}

navigate(url);
  };

  // =========================
  // INFINITE SCROLL
  // =========================
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  // =========================
  // UI
  // =========================
  return (
<div
  className={`min-h-screen px-3 sm:px-5 lg:px-8 py-4 sm:py-6 ${
    theme === "dark"
      ? "bg-zinc-950"
      : "bg-[#f5f7fb]"
  }`}
>
      {/* HEADER */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
 <div className="flex items-center gap-3 sm:gap-4 min-w-0">
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
      <Bell className="w-5 h-5 text-white" />
    </div>

    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        {t.notificationpage.title}
      </h1>

     
    </div>
  </div>

  {unreadNotifications.length > 0 && (
    <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
      {unreadNotifications.length} unread
    </div>
  )}
</div>

     <CommonCard
  className="
    p-0
    overflow-hidden
    rounded-3xl
    border border-slate-200
    shadow-xl
    bg-white
  "
>
        {/* FILTERS */}
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
          <div className="flex gap-2 overflow-x-auto">
            {FILTERS.map((f) => {
              const isActive = type === f.value;

              return (
              <Button
  key={f.label}
  onClick={() => setType(f.value)}
  className={`
    rounded-xl
    px-5
    py-2.5
    font-medium
    transition-all
    ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "bg-white text-slate-600 border border-slate-200 hover:border-blue-200 hover:bg-blue-50"
    }
  `}
>
  {f.label}
</Button>
              );
            })}
          </div>
        </div>

        {/* ACTIONS */}
        <NotificationHeader
          toggleSelectAll={toggleSelectAll}
          selected={selected}
          total={unreadNotifications.length}
          markAllAsRead={handleMarkAllAsRead}
          markSelectedAsRead={markSelectedAsRead}
        />

        {/* LIST */}
       <div
  className="
    h-[72vh]
    overflow-y-auto
    bg-[#fafbfc]
  "
>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <CommonSpinner />
            </div>
          ) : (
            <NotificationContent
              notifications={notifications}
              selected={selected}
              toggleSelect={toggleSelect}
              onNotificationClick={handleNotificationClick}
            />
          )}

          {/* SENTINEL */}
          <div ref={loaderRef} className="flex justify-center py-5">
            {isFetchingNextPage && <CommonSpinner />}
          </div>
        </div>
      </CommonCard>
    </div>
  );
}