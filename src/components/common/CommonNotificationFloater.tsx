import { useLanguage } from "@/features/context/LanguageContext";
import { useAuthStore } from "@/features/core/store/auth";

import { useNotifications } from "@/features/Notifications/presentation/hooks/useNotifications";


import { useState, useRef, useEffect, } from "react";
import { useNavigate } from "react-router-dom";
import { getNotificationTarget } from "@/features/Notifications/presentation/utils/notificationNavigation";

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

const { data: notifications = [] } = useNotifications({
  page: 1,
  limit: 100,
  unreadOnly: false,
});

const unreadCount = useAuthStore(
  (state) => state.notifications.unreadCount
);

  const handleNotificationClick = (item: any) => {
    const target = getNotificationTarget(item);

    if (target) {
      navigate(target);
      setOpen(false);
    }
  };

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-5 h-5"
        >
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>

        {/* 🔴 Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-4 h-4 px-1 text-[10px] bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`
            absolute z-50 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden
            w-72 sm:w-80 right-0
            ${direction === "up"
              ? "left-1/2 -translate-x-1/2 bottom-full mb-3"
              : "top-full mt-3"}
          `}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
              {t.notificationpage.title} ({notifications.length})
            </h3>

            <button
              onClick={() => {
                navigate("/notifications");
                setOpen(false);
              }}
              className="text-xs sm:text-sm text-blue-600 hover:underline"
            >
              {t.navbar["Show All"]}
            </button>
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">
                No notifications
              </p>
            ) : (
              notifications.map((item) => (
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
