import { CommandCard } from "@/components/common/CommonCards";
import { Home } from "lucide-react";
import { BookingStatus } from "../../domain/entities/bookingstatus.types";
import { useBookings } from "../hooks/useBookings";
import { useState } from "react";
import type { Booking } from "../../domain/entities/booking.types";
import BookingHistoryViewDetailsModal from "./BookingHistoryViewDetailsModal";
import { formatSmartDate } from "@/features/Confirmation/presentation/helpers/formatdatetime";

interface Props {
  activeTab: string;
}

const statusStyles: Record<BookingStatus, string> = {
  [BookingStatus.COMPLETED]:
    "bg-emerald-50 text-emerald-600 border border-emerald-200",
  [BookingStatus.IN_PROGRESS]:
    "bg-blue-50 text-blue-600 border border-blue-200",
  [BookingStatus.WORKER_ACCEPTED]:
    "bg-amber-50 text-amber-600 border border-amber-200",
  [BookingStatus.CUSTOMER_CANCELLED]:
    "bg-red-50 text-red-600 border border-red-200",
  [BookingStatus.WORKER_REJECTED]:
    "bg-blue-100 text-blue-700 border border-blue-300",
  [BookingStatus.REQUESTED]:
    "bg-gray-50 text-gray-600 border border-gray-200",
  [BookingStatus.WORKER_CANCELLED]:
    "bg-red-100 text-red-700 border border-red-300",
  [BookingStatus.WORK_COMPLETED_PENDING]:
    "bg-yellow-50 text-yellow-600 border border-yellow-200",
  [BookingStatus.INVOICE_GENERATED]:
    "bg-purple-50 text-purple-600 border border-purple-200",
  [BookingStatus.PAYMENT_PENDING]:
    "bg-orange-50 text-orange-600 border border-orange-200",
  [BookingStatus.PAID]:
    "bg-green-50 text-green-600 border border-green-200",
  [BookingStatus.CUSTOMER_REJECTED]:
    "bg-pink-50 text-pink-600 border border-pink-200",
};

const formatStatus = (status: BookingStatus) =>
  status.replaceAll("_", " ");

/* 🔥 Tab → Status Mapping */
const tabStatusMap: Record<string, BookingStatus[]> = {
  "In Progress": [BookingStatus.IN_PROGRESS],
  Completed: [BookingStatus.COMPLETED],
  Scheduled: [BookingStatus.WORKER_ACCEPTED, BookingStatus.REQUESTED],
  Requested:[BookingStatus.REQUESTED],
  Cancelled: [
    BookingStatus.CUSTOMER_CANCELLED,
    BookingStatus.WORKER_CANCELLED,
    BookingStatus.WORKER_REJECTED,
  ],
};

export default function BookingHistoryContents({ activeTab }: Props) {
  const { bookings, loading, error } = useBookings();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
const [modalOpen, setModalOpen] = useState(false);
  const filteredBookings =
    bookings?.filter((booking) =>
      activeTab === "All" ? true : tabStatusMap[activeTab]?.includes(booking.status)
    ) ?? [];

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-400">
        Loading bookings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load bookings.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {filteredBookings.map((booking) => (
        <CommandCard
          key={booking._id}
          className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="text-[16px] sm:text-[17px] font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs">
                  {booking.serviceId?.name ?? "Service Name"}
                </h3>
                <p className="text-sm sm:text-[14px] text-gray-500 font-medium truncate max-w-[200px] sm:max-w-xs">
                  {booking.serviceTierId?.displayName ?? "Tier"} • {"Worker Name"}
                </p>
              </div>
            </div>

            <span
              className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wide ${
                statusStyles[booking.status]
              }`}
            >
              {formatStatus(booking.status)}
            </span>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 sm:p-5 bg-gray-50 rounded-xl mb-4">
            <div>
              <span className="text-xs sm:text-sm text-gray-500 font-medium">
                Date
              </span>
              <p className="text-sm sm:text-base font-semibold">
                {formatSmartDate(booking.schedule?.startDateTime)}
              </p>
            </div>
            <div>
              <span className="text-xs sm:text-sm text-gray-500 font-medium">
                Duration
              </span>
             <p className="text-sm sm:text-base font-semibold">
                {booking.schedule
                    ? booking.pricingMode === "HOURLY"
                    ? `${booking.schedule.estimatedHours ?? "-"} hrs`
                    : `${booking.schedule.estimatedDays ?? "-"} days`
                    : "-"}
                </p>

            </div>
            <div>
              <span className="text-xs sm:text-sm text-gray-500 font-medium">
                Booking ID
              </span>
              <p className="text-sm sm:text-base font-semibold truncate">
                {booking._id}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <span className="text-lg sm:text-xl font-bold text-gray-900">
             {booking.currency} {booking.amount.toFixed(2)} 
            </span>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 w-full sm:w-auto">
              <button className="w-full cursor-pointer sm:w-auto px-5 py-2 rounded-lg text-sm font-semibold bg-white border border-gray-200 hover:bg-gray-50 transition-all">
                {booking.status === BookingStatus.IN_PROGRESS
                  ? "Track"
                  : booking.status === BookingStatus.WORKER_ACCEPTED
                  ? "Reschedule"
                  : "Rebook"}
              </button>
              <button onClick={() => {
    setSelectedBooking(booking);
    setModalOpen(true);
  }} className="w-full  cursor-pointer sm:w-auto px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all">
                View Details
              </button>
            </div>
          </div>
        </CommandCard>
      ))}
      <BookingHistoryViewDetailsModal
  booking={selectedBooking}
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
/>

      {filteredBookings.length === 0 && (
        <div className="text-center text-gray-400 py-10">
          No bookings found.
        </div>
      )}
    </div>
  );
}
