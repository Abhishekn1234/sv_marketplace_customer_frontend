import { X } from "lucide-react";
import { formatSmartDate } from "@/features/Confirmation/presentation/helpers/formatdatetime";
import type { BookingHistory } from "../../domain/entities/bookinghistory.types";
import { formatBookingDuration } from "../helpers/formatduration";

interface Props {
  booking: BookingHistory | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingHistoryViewDetailsModal({
  booking,
  isOpen,
  onClose,
}: Props) {
  if (!isOpen || !booking) return null;

  // Safe values
  const serviceName = booking.service?.name ?? "Service Details";
  const tierName = booking.serviceTier?.displayName ?? "Tier";
  const workerName =
    booking?.assignedWorkers?.[0]?.worker?.fullName ?? "Not Assigned";

  const bookingDate = booking.schedule?.startDateTime
    ? formatSmartDate(booking.schedule.startDateTime)
    : "-";

 const duration =formatBookingDuration(booking);
  const price =
    booking.amount !== undefined
      ? `${booking.currency} ${booking.amount.toFixed(2)}`
      : "-";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 sm:p-8 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {serviceName}
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          {tierName} • {workerName}
        </p>

        {/* Booking Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

          <div>
            <span className="text-xs text-gray-500 font-medium">
              Booking ID
            </span>
            <p className="text-sm font-semibold break-all">
              {booking._id ?? "-"}
            </p>
          </div>

          <div>
            <span className="text-xs text-gray-500 font-medium">
              Date
            </span>
            <p className="text-sm font-semibold">{bookingDate}</p>
          </div>

          <div>
            <span className="text-xs text-gray-500 font-medium">
              Duration
            </span>
            <p className="text-sm font-semibold">{duration}</p>
          </div>

          <div>
            <span className="text-xs text-gray-500 font-medium">
              Price
            </span>
            <p className="text-sm font-semibold">{price}</p>
          </div>

          <div className="sm:col-span-2">
            <span className="text-xs text-gray-500 font-medium">
              Work Description
            </span>
            <p className="text-sm font-semibold">
              {booking.workDescription ?? "-"}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-gray-100 hover:bg-gray-200 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
