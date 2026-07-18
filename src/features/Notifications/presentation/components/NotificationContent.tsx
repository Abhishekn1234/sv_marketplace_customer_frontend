

import { useLanguage } from "@/features/context/LanguageContext";
import Button from "@/components/input/Button";
import { isToday, isYesterday } from "date-fns";
import { getKey } from "../utils/notificationkeycontents";
import { BellIcon } from "@/components/icons/BellIcon";
import { CheckCircle2Icon, CircleIcon, ClockIcon } from "@/components/icons";

export default function NotificationContent({
  notifications,
  selected,
  toggleSelect,
  selectAll,
  onNotificationClick,
}: any) {
  const { t, lang } = useLanguage();

  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center py-20 sm:py-28 px-6">
        <div className="relative mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-transparent flex items-center justify-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-slate-200 flex items-center justify-center">
              <BellIcon className="w-6 h-6 sm:w-7 sm:h-7 text-slate-300" />
            </div>
          </div>
        </div>

        <h3 className="text-sm sm:text-[15px] font-semibold text-slate-700 mb-1.5">
          {t.notificationpage.noNotifications}
        </h3>

        <p className="text-xs sm:text-[13px] text-slate-400 max-w-[220px] leading-relaxed">
          {t.notificationpage.noNotificationsDesc}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-1 sm:px-2 py-2 sm:py-3">
      {notifications.map((n: any,index:number) => {
        // console.log(notifications);
       const notificationId = n._id || n.id;
     
      const isSelected =
  (selectAll && !n.isRead) || selected.includes(notificationId);
        const isUnread = !n.isRead;

        const createdAt = new Date(n.createdAt);

        const timeStr = createdAt.toLocaleTimeString(lang, {
          hour: "2-digit",
          minute: "2-digit",
        });

        const displayDate = isToday(createdAt)
          ? `${(t.common as any)?.today || "Today"}, ${timeStr}`
          : isYesterday(createdAt)
          ? `${(t.common as any)?.yesterday || "Yesterday"}, ${timeStr}`
          : `${createdAt.toLocaleDateString(lang, {
              month: "short",
              day: "numeric",
            })}, ${timeStr}`;
           const key = getKey(n, index);
        return (
          <div
            key={key}
            onClick={() => {
              if (n.isRead) return;
              onNotificationClick?.(n);
            }}
            aria-disabled={n.isRead}
            className={`
              group
              mx-2 sm:mx-4
              my-2
              rounded-xl sm:rounded-2xl
              border
              bg-transparent
              p-3 sm:p-5
              transition-all duration-300
              active:scale-[0.99]

              ${
                n.isRead
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:shadow-md"
              }

              ${
                isSelected
                  ? "border-blue-500 bg-blue-50/30"
                  : isUnread
                  ? "border-slate-200 hover:border-blue-200"
                  : "border-slate-200"
              }
            `}
          >
            <div className="flex gap-2 sm:gap-4">
              {/* Select */}
              <Button
                variant="ghost"
                disabled={n.isRead}
                onClick={(e) => {
                  e.stopPropagation();
                  if (n.isRead) return;
                 toggleSelect(notificationId);
                }}
                className="p-0 h-fit hover:bg-transparent shrink-0 mt-1"
              >
                {isSelected ? (
                  <CheckCircle2Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 fill-blue-100" />
                ) : (
                  <CircleIcon
                    className={`
                      w-4 h-4 sm:w-5 sm:h-5 transition-colors
                      ${
                        n.isRead
                          ? "text-slate-200"
                          : "text-slate-300 group-hover:text-blue-400"
                      }
                    `}
                  />
                )}
              </Button>

              {/* Unread dot */}
              <div className="shrink-0 pt-2">
                {isUnread && (
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col">
                  {/* Title */}
                  <h3
                    className={`
                      text-sm sm:text-[15px]
                      font-semibold
                      leading-5
                      break-words
                      ${isUnread ? "text-slate-900" : "text-slate-500"}
                    `}
                  >
                    {n.title}
                  </h3>

                  {/* Message */}
                  <p
                    className={`
                      mt-1
                      text-xs sm:text-sm
                      leading-5
                      line-clamp-3 sm:line-clamp-2
                      break-words
                      ${isUnread ? "text-slate-600" : "text-slate-400"}
                    `}
                  >
                    {n.message}
                  </p>

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-3">
                    <span className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-slate-500 px-2 sm:px-3 py-1 rounded-full border border-slate-200">
                      <ClockIcon className="w-3 h-3" />
                      {displayDate}
                    </span>

                    <Button
                      disabled={n.isRead}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (n.isRead) return;
                        onNotificationClick?.(n);
                      }}
                      variant="ghost"
                      className="
                        text-[11px] sm:text-xs
                        font-semibold
                        text-blue-600
                        rounded-lg
                        px-2 sm:px-3
                        py-1 sm:py-1.5
                        hover:bg-blue-50
                        disabled:opacity-40
                        disabled:pointer-events-none
                      "
                    >
                      {t.common.open}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}