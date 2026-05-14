import { useLanguage } from "@/features/context/LanguageContext";
import { useNotifications } from "@/features/Notifications/presentation/hooks/useNotifications";

import { useState, useRef, useEffect } from "react";
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
  // ZUSTAND (GLOBAL BADGE)
  // -----------------------------
    const setUnreadCount = useAuthStore(
    (state) => state.setUnreadCount
  );

  const unreadCount = useAuthStore(
    (state) => state.notifications.unreadCount
  );

  const { data: notifications = [] } = useNotifications({
    page: 1,
    limit: 100,
    unreadOnly: false,
  });

  // ✅ sync API → zustand ONCE
  useEffect(() => {
    const count = notifications.filter((n: any) => !n.isRead).length;
    setUnreadCount(count);
  }, [notifications]);

  const handleNotificationClick = (item: any) => {
    const target = getNotificationTarget(item);

    if (!target) return;

    // 🔥 instant update (NO REFRESH)
    setUnreadCount(Math.max(0, unreadCount - 1));

    navigate(target);
    setOpen(false);
  };

  // -----------------------------
  // CLICK NOTIFICATION
  // -----------------------------


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
      {/* Bell Button */}
      <Button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors"
      >
       <BellIcon/>

        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-4 h-4 px-1 text-[10px] bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {open && (
        <div
          className={`
            absolute z-50 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden
            w-72 sm:w-80 right-0
            ${
              direction === "up"
                ? "left-1/2 -translate-x-1/2 bottom-full mb-3"
                : "top-full mt-3"
            }
          `}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
              {t.notificationpage.title} ({notifications.length})
            </h3>

            <Button
              onClick={() => {
                navigate("/notifications");
                setOpen(false);
              }}
              className="text-xs sm:text-sm text-blue-600 hover:underline"
            >
              {t.navbar["Show All"]}
            </Button>
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">
                {t.notificationpage.noNotifications}
              </p>
            ) : (
              notifications.map((item: any) => (
                <div
                  key={item.id || item._id}
                  onClick={() => handleNotificationClick(item)}
                  className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors duration-200"
                >
                  <p className="text-sm font-semibold text-gray-800">
                    {item.title}
                  </p>

                  <p className="text-xs text-gray-500 truncate">
                    {item.message}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {item.time}
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