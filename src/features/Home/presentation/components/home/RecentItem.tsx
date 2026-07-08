import { ArrowRight } from "@/components/icons";
import { Image } from "@/components/input";
import { useLanguage } from "@/features/context/LanguageContext";
import { useNavigate } from "react-router-dom";

interface RecentItemProps {
  bookingId?: string;
  categoryId?: string;
  serviceId?: string;
  title: string;
  date: string;
  price: string;
  iconUrl?: string;
  status?: string;
}

export const RecentItem: React.FC<RecentItemProps> = ({
  bookingId,
  categoryId,
  serviceId,
  title,
  date,
  price,
  iconUrl,
  status,
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // -----------------------------
  // NORMALIZE STATUS
  // -----------------------------
  const normalizedStatus = (status ?? "").toUpperCase();

  // -----------------------------
  // STATUS FLAGS
  // -----------------------------
  const isCancelled = [
    "CUSTOMER_CANCELLED",
    "WORKER_CANCELLED",
  ].includes(normalizedStatus);

  const isPaid = normalizedStatus === "PAID";

  // ✅ Every status except PAID & Cancelled is trackable
  const isTrack = !isCancelled && !isPaid;

  // -----------------------------
  // NAVIGATION
  // -----------------------------
  const handleNavigate = () => {
    if (isCancelled) return;

    // Track all active bookings
    if (isTrack && bookingId) {
      navigate(`/jobtracking/${bookingId}`);
      return;
    }

    // Paid booking -> Booking history/details
    if (isPaid && bookingId) {
      navigate("/bookings");
      return;
    }

    // Fallback -> Rebook
    if (categoryId && serviceId) {
      navigate(`/services/${categoryId}`);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      className={`
        flex items-center gap-3.5
        p-2 -m-2 rounded-xl
        transition-all duration-200
        group
        ${
          isCancelled
            ? "bg-gray-100 opacity-70 cursor-not-allowed"
            : "cursor-pointer hover:bg-gray-50 hover:translate-x-1"
        }
      `}
    >
      {/* ICON */}
      <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
        {iconUrl ? (
          <Image
            src={iconUrl}
            alt={title}
            className="w-6 h-6 object-contain"
          />
        ) : (
          <div className="w-6 h-6 bg-gray-300 rounded" />
        )}
      </div>

      {/* INFO */}
      <div className="flex-1 min-w-0">
        <div className="truncate text-[15px] font-semibold text-gray-900">
          {title}
        </div>

        <div className="text-[13px] text-gray-400">
          {date}
        </div>
      </div>

      {/* PRICE / ACTION */}
      <div className="flex-shrink-0 text-right">
        <div
          className={`text-[15px] font-semibold ${
            isCancelled ? "text-gray-400" : "text-gray-900"
          }`}
        >
          {price}
        </div>

        {!isCancelled ? (
          <div className="text-[13px] font-semibold text-amber-600 transition-all group-hover:text-amber-700">
            {isTrack ? (
              <span className="flex items-center gap-1">
                {t.home.Track}
                <ArrowRight />
              </span>
            ) : isPaid ? (
              t.onboarding.view
            ) : categoryId && serviceId ? (
              t.Bookingspage.Actions.rebook
            ) : (
              ""
            )}
          </div>
        ) : (
          <div className="text-[13px] font-semibold text-gray-500">
            {t.common.Cancelled}
          </div>
        )}
      </div>
    </div>
  );
};