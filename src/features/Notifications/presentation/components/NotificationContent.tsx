import { CheckCircle2, Circle, Bell, Clock, MessageSquare } from "lucide-react";
import type { Notification } from "./NotificationCards";

interface Props {
  notifications: Notification[];
  selected: number[];
  toggleSelect: (id: number) => void;
}

export default function NotificationContent({
  notifications,
  selected,
  toggleSelect,
}: Props) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Bell className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">No notifications yet</h3>
        <p className="text-sm text-gray-500 max-w-sm">
          When you get notifications, they'll appear here. Stay tuned for updates!
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {notifications.map((notification, index) => {
        const isSelected = selected.includes(notification.id);
        const isUnread = !notification.read;

        return (
          <div
            key={notification.id}
            className={`group relative transition-all duration-300 hover:bg-gray-50/80 ${
              isUnread ? "bg-blue-50/30" : ""
            } ${isSelected ? "bg-blue-50/50" : ""}`}
            style={{
              animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
            }}
          >
            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5">
              {/* Custom Checkbox */}
              <button
                onClick={() => toggleSelect(notification.id)}
                className="flex-shrink-0 mt-1 focus:outline-none"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="sr-only"
                  />
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 transition-all duration-200 hover:scale-110" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 transition-all duration-200 hover:text-blue-400 hover:scale-110 group-hover:text-gray-400" />
                  )}
                </div>
              </button>

              {/* Unread indicator */}
              {isUnread && (
                <div className="absolute left-12 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-sm sm:text-base truncate ${
                        isUnread
                          ? "font-semibold text-gray-900"
                          : "font-medium text-gray-700"
                      }`}
                    >
                      {notification.title}
                    </h3>
                    {isUnread && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        New
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{notification.time}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed break-words">
                  {notification.message}
                </p>

                {/* Message icon for longer messages indicator */}
                {notification.message.length > 50 && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <MessageSquare className="w-3 h-3" />
                    <span>Click to expand</span>
                  </div>
                )}
              </div>

              {/* Quick action on hover */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => toggleSelect(notification.id)}
                  className="p-1.5 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-300" />
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}