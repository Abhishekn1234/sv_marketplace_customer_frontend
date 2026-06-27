
import { formatSmartDate } from "@/features/Confirmation/presentation/utils/formatdatetime";
import type { BookingHistory } from "../../domain/entities/bookinghistory.types";
import { formatBookingDuration } from "../utils/formatduration";
import Button from "@/components/input/Button";
import { useLanguage } from "@/features/context/LanguageContext";
import CommonModal from "@/components/common/CommonModal";

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
  const { t,isRTLOrder } = useLanguage();

  if (!isOpen || !booking) return null;

  // Safe values
  const serviceName = booking.service?.name ?? "Service Details";
  const tierName = booking.serviceTier?.displayName ?? "Tier";
  const workerName =
    booking?.assignedWorkers?.[0]?.worker?.fullName ?? "Not Assigned";

  const bookingDate = booking.schedule?.startDateTime
    ? formatSmartDate(booking.schedule.startDateTime)
    : "-";

  const duration = formatBookingDuration(booking);

  const price =
    booking.amount !== undefined
      ? `${booking.currency} ${booking?.totalCost?.toFixed(2)}`
      : "-";

  return (
 <CommonModal
  open={isOpen}
  onClose={onClose}
  title={serviceName}
  isRTLType={isRTLOrder}
  width="max-w-2xl"
  footer={
    <Button
      onClick={onClose}
      className="px-5 py-2 rounded-lg text-sm font-semibold bg-gray-100 hover:bg-gray-200 transition"
    >
      {t.common.close}
    </Button>
  }
>
  <div
    dir={isRTLOrder ? "rtl" : "ltr"}
    className={isRTLOrder ? "text-right" : "text-left"}
  >
    {/* Subtitle */}
    <p className="text-sm text-gray-500 mb-6">
      {tierName} • {workerName}
    </p>

    {/* Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <span className="text-xs text-gray-500 font-medium">
          {t.invoice.bookingRef}
        </span>
        <p className="text-sm font-semibold break-all">
          {booking._id ?? "-"}
        </p>
      </div>

      <div>
        <span className="text-xs text-gray-500 font-medium">
          {t.common.date}
        </span>
        <p className="text-sm font-semibold">{bookingDate}</p>
      </div>

      <div>
        <span className="text-xs text-gray-500 font-medium">
          {t.common.workedDuration}
        </span>
        <p className="text-sm font-semibold">{duration}</p>
      </div>

      <div>
        <span className="text-xs text-gray-500 font-medium">
          {t.common.totalPaid}
        </span>
        <p className="text-sm font-semibold">{price}</p>
      </div>

      <div className="sm:col-span-2">
        <span className="text-xs text-gray-500 font-medium">
          {t.common["Work Description"]}
        </span>
        <p className="text-sm font-semibold">
          {booking.workDescription ?? "-"}
        </p>
      </div>
    </div>
  </div>
</CommonModal>
  );
}