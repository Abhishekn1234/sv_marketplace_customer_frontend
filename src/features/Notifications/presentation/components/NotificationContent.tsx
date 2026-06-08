import {
  CheckCircle2,
  Circle,
  Bell,
  Clock,
} from "lucide-react";

import { useLanguage } from "@/features/context/LanguageContext";
import Button from "@/components/input/Button";
import { isToday, isYesterday } from "date-fns";

export default function NotificationContent({
  notifications,
  selected,
  toggleSelect,
  onNotificationClick,
}: any) {
  const { t, lang } = useLanguage();

  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center py-28 px-6">
        <div className="relative mb-6">
          {/* Outer ring */}
          <div className="w-24 h-24 rounded-full bg-gray-100/80 flex items-center justify-center">
            {/* Inner ring */}
            <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center">
              <Bell className="w-7 h-7 text-gray-300" />
            </div>
          </div>
        </div>
        <h3 className="text-[15px] font-semibold text-gray-700 mb-1.5">
          {t.notificationpage.noNotifications}
        </h3>
        <p className="text-[13px] text-gray-400 max-w-[220px] leading-relaxed">
          {t.notificationpage.noNotificationsDesc}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-gray-100/80">
      {notifications.map((n: any) => {
        const isSelected = selected.includes(n.id);
        const isUnread = !n.isRead;

        const createdAt = new Date(n.createdAt);
        const timeStr = createdAt.toLocaleTimeString(lang, {
          hour: "2-digit",
          minute: "2-digit",
        });
        const displayDate =
          isToday(createdAt) || isYesterday(createdAt)
            ? timeStr
            : `${createdAt.toLocaleDateString(lang, {
                month: "short",
                day: "numeric",
              })}, ${timeStr}`;

        return (
          <div
            key={n.id}
            onClick={() => onNotificationClick?.(n)}
            className={`
              group flex items-start gap-3.5 sm:gap-4 px-4 sm:px-5 py-4 cursor-pointer
              transition-colors duration-150 relative
              ${isSelected
                ? "bg-blue-50/80"
                : isUnread
                ? "bg-blue-50/40 hover:bg-blue-50/60"
                : "bg-white hover:bg-gray-50/60"}
            `}
          >
            {/* Unread left border accent */}
            {isUnread && (
              <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-blue-500 rounded-r-full" />
            )}

            {/* Checkbox */}
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                toggleSelect(n.id);
              }}
              className="mt-1 p-0 hover:bg-transparent flex-shrink-0 transition-transform active:scale-90"
            >
              {isSelected ? (
                <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-100" />
              ) : (
                <Circle className="w-5 h-5 text-gray-200 group-hover:text-blue-300 transition-colors" />
              )}
            </Button>

            {/* Content */}
            <div className={`flex-1 min-w-0 ${!isUnread ? "opacity-60" : ""}`}>
              {/* Top row */}
              <div className="flex justify-between items-start gap-3 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  {isUnread && (
                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  )}
                  <h3
                    className={`
                      text-[14px] font-semibold truncate leading-tight
                      ${isUnread
                        ? "text-gray-800 group-hover:text-blue-700 transition-colors"
                        : "text-gray-500"}
                    `}
                  >
                    {n.title}
                  </h3>
                </div>

                {/* Time badge */}
                <span
                  className="
                    flex-shrink-0 flex items-center gap-1 text-[11px] font-medium
                    text-gray-400 bg-gray-100/80 group-hover:bg-blue-50
                    px-2 py-0.5 rounded-full transition-colors whitespace-nowrap
                  "
                >
                  <Clock className="w-3 h-3" />
                  {displayDate}
                </span>
              </div>

              {/* Bottom row */}
              <div className="flex justify-between items-end gap-3">
                <p
                  className={`
                    text-[13px] leading-relaxed line-clamp-2 flex-1
                    ${isUnread ? "text-gray-500" : "text-gray-400"}
                  `}
                >
                  {n.message}
                </p>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNotificationClick?.(n);
                  }}
                  variant="ghost"
                  className="
                    shrink-0 text-[12px] font-semibold text-blue-600
                    px-2.5 py-1 rounded-lg
                    hover:bg-blue-50 transition-colors
                  "
                >
                  {t.common.open}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}