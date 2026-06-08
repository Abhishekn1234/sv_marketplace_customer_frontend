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

    markAsRead(notification.id);
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
    <div className={`w-full ${theme === "dark" ? "bg-black" : "bg-white"}`}>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
          <Bell className="text-white w-4 h-4" />
        </div>

        <h1 className="text-lg font-semibold">
          {t.notificationpage.title}
        </h1>

        {unreadNotifications.length > 0 && (
          <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {unreadNotifications.length}
          </span>
        )}
      </div>

      <CommonCard className="p-0 overflow-hidden">
        {/* FILTERS */}
        <div className="px-4 py-3 border-b">
          <div className="flex gap-2 overflow-x-auto">
            {FILTERS.map((f) => {
              const isActive = type === f.value;

              return (
                <Button
                  key={f.label}
                  onClick={() => {
                    setType(f.value);
                  }}
                  variant={isActive ? "default" : "ghost"}
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
        <div className="h-[70vh] overflow-y-auto bg-white">
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