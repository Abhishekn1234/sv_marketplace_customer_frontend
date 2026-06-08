"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";

import { useLanguage } from "@/features/context/LanguageContext";
import { useNotifications } from "@/features/Notifications/presentation/hooks/useNotifications";
import { useMarkNotificationRead } from "@/features/Notifications/presentation/hooks/useMarkNotificationRead";
import { getNotificationTarget } from "@/features/Notifications/presentation/utils/notificationNavigation";



type Props = {
  direction?: "up" | "down";
};

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
  // API FETCH (SOURCE OF TRUTH)
  // -----------------------------
  const { data } = useNotifications(notificationFilters);

  const notifications = data?.pages.flatMap((p) => p.data)?? [];

  // -----------------------------
  // MARK AS READ API
  // -----------------------------
  const { mutateAsync: markAsRead } = useMarkNotificationRead();

  // -----------------------------
  // UNREAD COUNT (FIXED)
  // -----------------------------
  const unreadCount = useMemo(() => {
    return notifications.filter((n: any) => !n.isRead).length;
  }, [notifications]);

  // -----------------------------
  // CLICK HANDLER (OPTIMISTIC SAFE)
  // -----------------------------
  const handleNotificationClick = async (item: any) => {
    const target = getNotificationTarget(item);
    if (!target) return;

    const id = item.id || item._id;

    try {
      // 1. optimistic UI update
      item.isRead = true;

      // 2. API sync
      await markAsRead(id);

      // 3. navigate
      navigate(target);

      // 4. close dropdown
      setOpen(false);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  // -----------------------------
  // OUTSIDE CLICK CLOSE
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
      {/* BUTTON */}
      <Button
        onClick={() => setOpen((prev) => !prev)}
        variant="ghost"
        className="relative p-2  hover:text-blue-600"
      >
        <BellIcon />

        {/* BADGE */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-4 h-4 px-1 text-[10px] bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* DROPDOWN */}
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
              {t.notificationpage.title} ({unreadCount})
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
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">
                {t.notificationpage.noNotifications}
              </p>
            ) : (
              notifications.map((item: any) => (
                <div
                  key={item.id || item._id}
                  className={`px-4 py-3 border-b last:border-b-0 ${
                    !item.isRead ? "bg-blue-50/40" : "bg-white"
                  }`}
                >
                  <div
                    onClick={() => handleNotificationClick(item)}
                    className="cursor-pointer"
                  >
                    <p className="text-sm font-semibold">
                      {item.title}
                    </p>

                    <p className="text-xs text-gray-500 truncate">
                      {item.message}
                    </p>
                  </div>

                  <div className="mt-2 flex justify-end">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNotificationClick(item);
                      }}
                      className="text-xs text-blue-600"
                    >
                      Open
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}