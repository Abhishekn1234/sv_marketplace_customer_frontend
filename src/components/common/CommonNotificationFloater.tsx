import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead?: boolean;
}

export default function CommonNotificationFloater() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Mock Data
  const notifications: Notification[] = [
    {
      id: "1",
      title: "Booking Confirmed",
      message: "Your cleaning service is confirmed.",
      time: "2h ago",
      isRead: false,
    },
    {
      id: "2",
      title: "Payment Successful",
      message: "₹1200 payment completed successfully.",
      time: "5h ago",
      isRead: false,
    },
    {
      id: "3",
      title: "New Offer 🎉",
      message: "Get 20% off on plumbing services.",
      time: "1 day ago",
      isRead: true,
    },
    {
      id: "4",
      title: "Reminder",
      message: "Your service starts tomorrow at 10 AM.",
      time: "2 days ago",
      isRead: true,
    },
  ];

  const latestThree = notifications.slice(0, 3);

  // Close when clicking outside
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

        {/* Badge */}
        <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">
              Notifications
            </h3>
            <button
              onClick={() => {
                navigate("/notifications");
                setOpen(false);
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              Show all
            </button>
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto">
            {latestThree.map((item) => (
              <div
                key={item.id}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${
                  !item.isRead ? "bg-blue-50" : ""
                }`}
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}