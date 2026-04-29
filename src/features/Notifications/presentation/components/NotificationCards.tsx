import { useState } from "react";
import NotificationHeader from "./NotificationHeader";
import NotificationContent from "./NotificationContent";
import { Bell } from "lucide-react";
import { useLanguage } from "@/features/context/LanguageContext";
import { useNotifications } from "@/features/Notifications/presentation/hooks/useNotifications";
import { useRegisterDeviceToken } from "@/features/Notifications/presentation/hooks/useRegisterDeviceToken";
import { useUnreadCount } from "@/features/Notifications/presentation/hooks/useUnreadCount";
import { useMarkAllAsRead } from "@/features/Notifications/presentation/hooks/useMarkAllAsRead";
import { useMarkNotificationRead } from "@/features/Notifications/presentation/hooks/useMarkNotificationRead";

export default function NotificationCards() {
  const { t } = useLanguage();

  const [type, setType] = useState<any>(undefined);
  const [selected, setSelected] = useState<string[]>([]);

  const {
    data: apiNotifications = [],
    loading,
    refetch: refetchNotifications,
  } = useNotifications({
    page: 1,
    limit: 10,
    type,
    unreadOnly: false,
  });

  const { count: unreadCount, refetch: refetchUnreadCount } =
    useUnreadCount();

  const { markAllAsRead } = useMarkAllAsRead();
  const { markAsRead } = useMarkNotificationRead();

  const { fcmNotifications = [] } = useRegisterDeviceToken();

  /* ✅ Normalize FCM */
  const normalizedFCM = fcmNotifications.map((msg: any) => ({
    id: msg.id,
    title: msg.title,
    message: msg.message,
    type: "ADMIN_MESSAGE",
    isRead: false,
    createdAt: msg.createdAt,
  }));

  /* ✅ Normalize API */
  const normalizedAPI = apiNotifications.map((n: any) => ({
    ...n,
    id: String(n.id),
  }));

  /* ✅ Merge */
  const notifications = [...normalizedFCM, ...normalizedAPI];

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === notifications.length) {
      setSelected([]);
    } else {
      setSelected(notifications.map((n) => n.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Bell className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
            {t.notificationpage.notifications}
          </h1>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {[
            { label: "All", value: undefined },
            { label: "Requests", value: "BOOKING_REQUEST" },
            { label: "Updates", value: "BOOKING_UPDATE" },
            { label: "Admin", value: "ADMIN_MESSAGE" },
          ].map((f, i) => (
            <button
              key={i}
              onClick={() => setType(f.value)}
              className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition-all ${
                type === f.value
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Card */}
     <div className="w-full flex justify-center">
  <div
    className="
      w-full
      max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl
      
      bg-white 
      rounded-2xl 
      shadow-sm 
      border border-gray-100 
      overflow-hidden 
      flex flex-col 
      
      min-h-[400px] 
      sm:min-h-[450px] 
      md:min-h-[550px] 
      lg:min-h-[600px] 
      xl:min-h-[650px]

      px-3 sm:px-4 md:px-6 lg:px-6
    "
  >
  {/* Header */}
  <NotificationHeader
    toggleSelectAll={toggleSelectAll}
    selected={selected}
    total={notifications.length}
    markAllAsRead={async () => {
      await markAllAsRead();
      refetchUnreadCount();
      refetchNotifications();
    }}
    deleteSelected={() => {}}
    unreadCount={unreadCount}
  />

  {/* Content Area */}
  <div className="flex-1 flex flex-col">
    {loading ? (
      <div className="flex flex-1 items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    ) : notifications.length === 0 ? (
      <div className="flex flex-1 items-center justify-center text-gray-500 text-sm">
        No notifications found
      </div>
    ) : (
      <NotificationContent
        notifications={notifications}
        selected={selected}
        toggleSelect={toggleSelect}
        markAsRead={markAsRead}
      />
    )}
  </div>
</div>

        {/* Optional bottom loader for pagination */}
        {loading && notifications.length > 0 && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}