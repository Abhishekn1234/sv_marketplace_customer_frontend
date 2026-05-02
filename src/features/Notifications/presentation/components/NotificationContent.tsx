import { CheckCircle2, Circle, Bell, Clock } from "lucide-react";
import { useLanguage } from "@/features/context/LanguageContext";

export default function NotificationContent({
  notifications,
  selected,
  toggleSelect,
}: any) {
  const { t } = useLanguage();

  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
        <div className="p-4 bg-gray-100 rounded-full mb-3">
          <Bell className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">
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
            className={`
              flex items-start gap-3 px-4 py-4 cursor-pointer transition-all
              ${isUnread ? "bg-blue-10/40" : "bg-white"}
              ${isSelected ? "bg-blue-100/60" : "hover:bg-gray-50"}
            `}
          >
            {/* Checkbox */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSelect(n.id);
              }}
              className="mt-1"
            >
              {isSelected ? (
                <CheckCircle2 className="text-blue-600 w-5 h-5" />
              ) : (
                <Circle className="text-gray-300 w-5 h-5 hover:text-gray-400" />
              )}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h3
                  className={`text-sm font-semibold truncate ${
                    isUnread ? "text-gray-900" : "text-gray-700"
                  }`}
                >
                  {n.title}
                </h3>

                <span className="text-[11px] text-gray-400 flex items-center gap-1 whitespace-nowrap">
                  <Clock className="w-3 h-3" />
                  {new Date(n.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {n.message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}