import { useLanguage } from "@/features/context/LanguageContext";
import { useNotifications } from "@/features/Notifications/presentation/hooks/useNotifications";

import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getNotificationTarget } from "@/features/Notifications/presentation/utils/notificationNavigation";

import { useAuthStore } from "@/features/core/store/auth";
import { BellIcon } from "../icons/BellIcon";
import Button from "../input/Button";

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
  // ZUSTAND
  // -----------------------------
  const setUnreadCount = useAuthStore(
    (state) => state.setUnreadCount
  );

  const unreadCount = useAuthStore(
    (state) => state.notifications.unreadCount
  );

  // -----------------------------
  // FIXED FILTER (IMPORTANT)
  // -----------------------------
  const notificationFilters = useMemo(() => ({
    page: 1,
    limit: 100,
    unreadOnly: false,
  }), []);

  const { data: notifications = [] } =
    useNotifications(notificationFilters);

  // -----------------------------
  // SYNC UNREAD COUNT (NO LOOP)
  // -----------------------------
  useEffect(() => {
    const count = notifications.filter(
      (n: any) => !n.isRead
    ).length;

    const current = useAuthStore.getState().notifications.unreadCount;

    if (current !== count) {
      setUnreadCount(count);
    }
  }, [notifications, setUnreadCount]);

  // -----------------------------
  // CLICK HANDLER
  // -----------------------------
  const handleNotificationClick = (item: any) => {
    const target = getNotificationTarget(item);

    if (!target) return;

    setUnreadCount(Math.max(0, unreadCount - 1));

    navigate(target);
    setOpen(false);
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

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-4 h-4 px-1 text-[10px] bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount}
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
              {t.notificationpage.title} ({notifications.length})
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
                  onClick={() =>
                    handleNotificationClick(item)
                  }
                  className="px-4 py-3 cursor-pointer hover:bg-blue-50"
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