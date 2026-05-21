"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useLanguage } from "@/features/context/LanguageContext";
import {
  notificationKeys,
  useNotifications,
} from "@/features/Notifications/presentation/hooks/useNotifications";
import { getNotificationTarget } from "@/features/Notifications/presentation/utils/notificationNavigation";

import { useAuthStore } from "@/features/core/store/auth";

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
  const queryClient = useQueryClient();
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
  // FETCH API
  // -----------------------------
  const { data } = useNotifications(notificationFilters);

  // -----------------------------
  // ZUSTAND
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

  // -----------------------------
  // HYDRATE ZUSTAND FROM API
  // -----------------------------
  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      setNotificationsList(data.data);
    }
  }, [data, setNotificationsList]);

  // -----------------------------
  // COUNTS
  // -----------------------------
  const totalCount = notifications.length;

  const displayTotalCount =
    totalCount > 30 ? "30+" : totalCount;

  const displayUnreadCount =
    unreadCount > 30 ? "30+" : unreadCount;

  // -----------------------------
  // CLICK HANDLER
  // -----------------------------
  const handleNotificationClick = (item: any) => {
    const target = getNotificationTarget(item);

    if (!target) return;

    // ✅ Optimistic React Query update
    queryClient.setQueryData(
      notificationKeys.list(notificationFilters),
      (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: old.data.map((n: any) =>
            n.id === item.id || n._id === item._id
              ? { ...n, isRead: true }
              : n
          ),
        };
      }
    );

    // ✅ Zustand update
    useAuthStore
      .getState()
      .markNotificationRead(item.id || item._id);

    navigate(target);
    setOpen(false);
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
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
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
              {t.notificationpage.title} (
              {displayTotalCount})
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
                  onClick={() =>
                    handleNotificationClick(item)
                  }
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