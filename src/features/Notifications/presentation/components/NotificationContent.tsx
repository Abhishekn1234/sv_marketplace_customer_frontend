import {
  CheckCircle2,
  Circle,
  Bell,
  Clock,
} from "lucide-react";

import { useLanguage } from "@/features/context/LanguageContext";
import Button from "@/components/input/Button";

export default function NotificationContent({
  notifications,
  selected,
  toggleSelect,
  onNotificationClick,
}: any) {
  const { t } = useLanguage();

  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4">
        <div className="p-6 bg-slate-50 rounded-full mb-4 animate-pulse">
          <Bell className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Stay Tuned!</h3>
        <p className="text-gray-500 text-sm max-w-xs">
          {t.notificationpage.noNotifications}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {notifications.map((n: any) => {
        const isSelected = selected.includes(n.id);
        const isUnread = !n.isRead;

        return (
          <div
            key={n.id}
            onClick={() => onNotificationClick?.(n)}
            className={`
              flex items-start gap-4 px-5 py-5 cursor-pointer transition-all duration-300 relative border-b border-slate-100
              ${isUnread ? "bg-indigo-50/40" : "bg-white"}
              ${isSelected ? "bg-indigo-100/50" : "hover:bg-slate-50"}
            `}
          >
            {/* SELECT ONLY */}
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                toggleSelect(n.id);
              }}
              className="mt-1 p-0 hover:bg-transparent flex-shrink-0"
            >
              {isSelected ? (
                <CheckCircle2 className="text-indigo-600 w-5 h-5 fill-indigo-50" />
              ) : (
                <Circle className="text-slate-300 w-5 h-5 hover:text-indigo-400 transition-colors" />
              )}
            </Button>

            {/* CONTENT */}
            <div className={`flex-1 min-w-0 flex flex-col gap-1.5 ${!isUnread ? "opacity-80" : ""}`}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  {isUnread && (
                    <span className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full ring-4 ring-indigo-100" title="New" />
                  )}
                  <h3
                    className={`text-[14px] sm:text-[15px] font-bold truncate transition-colors ${
                      isUnread ? "text-slate-900" : "text-slate-600"
                    }`}
                  >
                    {n.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1 whitespace-nowrap font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3" />
                    {new Date(n.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNotificationClick?.(n);
                    }}
                    className="text-xs text-blue-600"
                    variant="ghost"
                  >
                    Open
                  </Button>
                </div>
              </div>

              <p className={`text-xs sm:text-sm leading-relaxed line-clamp-2 font-medium ${isUnread ? "text-slate-600" : "text-slate-400"}`}>
                {n.message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}