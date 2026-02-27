import { useState } from "react";
import NotificationHeader from "./NotificationHeader";
import NotificationContent from "./NotificationContent";
import { Bell} from "lucide-react";

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "Booking Confirmed",
    message: "Your cab booking has been confirmed. Driver will arrive shortly.",
    time: "2 mins ago",
    read: false,
  },
  {
    id: 2,
    title: "Driver Arriving",
    message: "Your driver is arriving in 5 minutes. Please be ready at the pickup point.",
    time: "10 mins ago",
    read: false,
  },
  {
    id: 3,
    title: "Payment Successful",
    message: "₹450 payment completed successfully for your recent ride.",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 4,
    title: "Weekend Special Offer",
    message: "Get 20% off on weekend rides! Use code WEEKEND20.",
    time: "2 hours ago",
    read: true,
  },
];

export default function NotificationCards() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelectAll = () => {
    if (selected.length === notifications.length) {
      setSelected([]);
    } else {
      setSelected(notifications.map((n) => n.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteSelected = () => {
    setNotifications((prev) => prev.filter((n) => !selected.includes(n.id)));
    setSelected([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with title and unread badge */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 px-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Notifications</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {unreadCount > 0 ? (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                    {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                  </span>
                ) : (
                  'All caught up!'
                )}
              </p>
            </div>
          </div>
          
          {/* Quick stats */}
          <div className="text-right">
            <p className="text-xs sm:text-sm text-gray-500">
              {notifications.length} total
            </p>
          </div>
        </div>

        {/* Main notification card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-lg backdrop-filter">
          <NotificationHeader
            toggleSelectAll={toggleSelectAll}
            selected={selected}
            total={notifications.length}
            markAllAsRead={markAllAsRead}
            deleteSelected={deleteSelected}
            unreadCount={unreadCount}
          />

          <NotificationContent
            notifications={notifications}
            selected={selected}
            toggleSelect={toggleSelect}
          />
        </div>
      </div>
    </div>
  );
}