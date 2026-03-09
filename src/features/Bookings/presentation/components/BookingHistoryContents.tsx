import { CommandCard } from "@/components/common/CommonCards";
import { Home } from "lucide-react";
import { BookingStatus } from "../../domain/entities/bookingstatus.types";
import { useState, useRef, useEffect } from "react";
import type { BookingHistory } from "../../domain/entities/bookinghistory.types";
import BookingHistoryViewDetailsModal from "./BookingHistoryViewDetailsModal";
import { formatSmartDate } from "@/features/Confirmation/presentation/helpers/formatdatetime";
import { useNavigate } from "react-router-dom";
import { useBookingHistory } from "../hooks/useBookingHistory";
import { getBookingButtonConfig } from "../helpers/bookingstatusbuttonmap";
import { formatStatus } from "../helpers/formatstatusmap";
import { tabStatusMap } from "../helpers/tabstatusmap";
import { statusStyles } from "../helpers/statusmap";
interface Props {
  activeTab: string;
}
export default function BookingHistoryContents({ activeTab }: Props) {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState<BookingHistory | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBookingHistory({ limit: 10 });

  const allBookings = data?.pages.flatMap(page => page.data) ?? [];

  const filteredBookings = allBookings.filter(booking =>
    activeTab === "All"
      ? true
      : tabStatusMap[activeTab]?.includes(booking.status as BookingStatus)
  );

  // Ref for infinite scroll
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" } // start loading slightly before reaching bottom
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [fetchNextPage, hasNextPage]);

  if (isLoading) {
    return <div className="text-center py-16 text-gray-400 text-sm sm:text-base">Loading bookings...</div>;
  }

  if (isError) {
    return <div className="text-center py-16 text-red-500 text-sm sm:text-base">Failed to load bookings.</div>;
  }

  if (filteredBookings.length === 0) {
    return <div className="text-center py-16 text-gray-400 text-sm sm:text-base">No bookings found.</div>;
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {filteredBookings.map(booking => (
        <CommandCard
          key={booking._id}
          className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
              </div>

              <div className="min-w-0">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-gray-900 truncate">
                  {booking.service?.name ?? "Service Name"}
                </h3>

                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {booking.serviceTier?.displayName ?? "Tier"} •{" "}
                  {booking.assignedWorkers?.[0]?.worker?.fullName ?? "Not assigned"}
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${
                statusStyles[booking.status as BookingStatus]
              }`}
            >
              {formatStatus(booking.status as BookingStatus)}
            </span>
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl mb-5">
            <div>
              <span className="text-xs text-gray-500">Date</span>
              <p className="text-sm sm:text-base font-semibold">
                {formatSmartDate(booking.schedule?.startDateTime)}
              </p>
            </div>

            <div>
              <span className="text-xs text-gray-500">Duration</span>
              <p className="text-sm sm:text-base font-semibold">
                {booking.schedule
                  ? booking.pricingMode === "HOURLY"
                    ? `${booking.schedule.estimatedHours ?? "-"} hrs`
                    : `${booking.schedule.estimatedDays ?? "-"} days`
                  : "-"}
              </p>
            </div>

            <div>
              <span className="text-xs text-gray-500">Booking ID</span>
              <p className="text-sm sm:text-base font-semibold truncate">
                {booking._id}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              {booking.currency} {booking.amount.toFixed(2)}
            </span>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
             <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {(() => {
                const { label, clickable } = getBookingButtonConfig(booking);

                return (
                  <button
                    onClick={() => {
                      if (clickable) navigate(`/jobtracking/${booking._id}`);
                    }}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 transition ${
                      !clickable ? "cursor-not-allowed opacity-60" : ""
                    }`}
                    disabled={!clickable}
                  >
                    {label}
                  </button>
                );
              })()}

              <button
                onClick={() => {
                  setSelectedBooking(booking);
                  setModalOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
            </div>
          </div>
        </CommandCard>
      ))}

      {/* Invisible div for intersection observer */}
      <div ref={loadMoreRef} className="h-1"></div>

      {isFetchingNextPage && (
        <div className="text-center py-4 text-gray-500 text-sm">Loading more...</div>
      )}

      <BookingHistoryViewDetailsModal
        booking={selectedBooking}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}