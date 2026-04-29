import { CheckCircle2, Circle, Bell, Clock } from "lucide-react";
import { useLanguage } from "@/features/context/LanguageContext";

export default function NotificationContent({
  notifications,
  selected,
  toggleSelect,
  markAsRead,
}: any) {
  const { t } = useLanguage();

  if (notifications.length === 0) {
    return (
     <div className="flex-1 flex flex-col items-center justify-center text-center">
        <Bell className="w-10 h-10 text-gray-400 mb-3" />
        <p className="text-gray-500">
          {t.notificationpage.noNotifications}
        </p>
      </div>
    );
  }

  return (
   <div className="flex flex-col h-full space-y-3 p-3 sm:p-4">
      {notifications.map((n: any) => {
        const isSelected = selected.includes(n.id);
        const isUnread = !n.isRead;

        return (
          <div
            key={n.id}
            onClick={() => markAsRead(n.id)}
            className={`relative rounded-xl border p-4 cursor-pointer transition-all ${
              isUnread
                ? "bg-blue-50 border-blue-100"
                : "bg-white border-gray-100"
            } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
          >
            <div className="flex items-start gap-3">
              <button onClick={(e) => {
                e.stopPropagation();
                toggleSelect(n.id);
              }}>
                {isSelected ? (
                  <CheckCircle2 className="text-blue-600 w-5 h-5" />
                ) : (
                  <Circle className="text-gray-300 w-5 h-5" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <h3 className="text-sm font-semibold">
                    {n.title}
                  </h3>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(n.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-sm text-gray-600">{n.message}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}