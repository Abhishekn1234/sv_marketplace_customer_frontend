"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useLanguage } from "@/features/context/LanguageContext";
import { useNotifications } from "@/features/Notifications/presentation/hooks/useNotifications";
import { getNotificationTarget } from "@/features/Notifications/presentation/utils/notificationNavigation";

import { useAuthStore } from "@/features/core/store/auth";
import { useMarkNotificationRead } from "@/features/Notifications/presentation/hooks/useMarkNotificationRead";

import Button from "../input/Button";
import { BellIcon } from "../icons/BellIcon";

interface Props {
  direction?: "up" | "down";
}

export default function CommonNotificationFloater({
  direction = "down",
}: Props) {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { t } = useLanguage();

  // -----------------------------
  // FILTER
  // -----------------------------
  const notificationFilters = useMemo(
    () => ({
      page: 1,
      limit: 100,
      unreadOnly: false,
    }),
    []
  );

  // -----------------------------
  // API FETCH
  // -----------------------------
  const { data } = useNotifications(notificationFilters);

  // -----------------------------
  // ZUSTAND STATE
  // -----------------------------
  const notifications = useAuthStore(
    (state) => state.notifications.list
  );

  const unreadCount = useAuthStore(
    (state) => state.notifications.unreadCount
  );

  const setNotificationsList = useAuthStore(
    (state) => state.setNotificationsList
  );

  const markNotificationRead = useAuthStore(
    (state) => state.markNotificationRead
  );

  const { markAsRead } = useMarkNotificationRead();

  // -----------------------------
  // HYDRATE STORE (IMPORTANT FIX)
  // -----------------------------
  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      setNotificationsList(
        data.data.map((n: any) => ({
          ...n,
          isRead: !!n.isRead, // normalize boolean
        }))
      );
    }
  }, [data, setNotificationsList]);

  // -----------------------------
  // COUNTS (NOW ALWAYS CORRECT)
  // -----------------------------
  // const totalCount = notifications.length;

  // const displayTotalCount =totalCount;

  const displayUnreadCount = unreadCount;
  // -----------------------------
  // CLICK HANDLER (FIXED FLOW)
  // -----------------------------
  const handleNotificationClick = async (item: any) => {
    const target = getNotificationTarget(item);

    if (!target) return;

    try {
      const id = item.id || item._id;

      // 1. API + Zustand update
      await markAsRead(id);

      // 2. ALSO ensure local list sync (instant UI safety)
      markNotificationRead(id);

      // 3. Navigate
      navigate(target);

      // 4. Close dropdown
      setOpen(false);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  // -----------------------------
  // OUTSIDE CLICK
  // -----------------------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 text-gray-400 hover:text-blue-600"
      >
        <BellIcon />

        {/* BADGE */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-4 h-4 px-1 text-[10px] bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-white">
            {displayUnreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div
          className={`absolute z-50 bg-white rounded-2xl shadow-xl border w-72 sm:w-80 right-0 ${
            direction === "up"
              ? "bottom-full mb-3"
              : "top-full mt-3"
          }`}
        >
          {/* HEADER */}
          <div className="px-4 py-3 border-b flex justify-between">
            <h3 className="font-semibold text-sm">
              {t.notificationpage.title} ({displayUnreadCount})
            </h3>

            <Button
              onClick={() => {
                navigate("/notifications");
                setOpen(false);
              }}
              className="text-xs text-blue-600"
            >
              {t.navbar["Show All"]}
            </Button>
          </div>

          {/* LIST */}
          <div className="max-h-72 overflow-y-auto">
            {notifications?.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">
                {t.notificationpage.noNotifications}
              </p>
            ) : (
              notifications.map((item: any) => (
                <div
                  key={item.id || item._id}
                  onClick={() => handleNotificationClick(item)}
                  className={`px-4 py-3 cursor-pointer hover:bg-blue-50 border-b last:border-b-0 ${
                    !item.isRead
                      ? "bg-blue-50/40"
                      : "bg-white"
                  }`}
                >
                  <p className="text-sm font-semibold">
                    {item.title}
                  </p>

                  <p className="text-xs text-gray-500 truncate">
                    {item.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}