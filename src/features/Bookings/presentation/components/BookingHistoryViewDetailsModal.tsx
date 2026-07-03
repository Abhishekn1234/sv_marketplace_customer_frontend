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
  const { t, isRTLOrder } = useLanguage();

  if (!booking) return null;

  const serviceName = booking.service?.name ?? "Service Details";
  const tierName = booking.serviceTier?.displayName ?? "-";
  const workerName =
    booking.assignedWorkers?.[0]?.worker?.fullName ?? t.common["Not Assigned"];

  const bookingDate = booking.schedule?.startDateTime
    ? formatSmartDate(booking.schedule.startDateTime)
    : "-";

  const duration = formatBookingDuration(booking);

  const price =
    booking.totalCost != null
      ? `${booking.currency} ${booking.totalCost.toFixed(2)}`
      : "-";

  return (
    <CommonModal
      open={isOpen}
      onClose={onClose}
      title={serviceName}
      isRTLType={isRTLOrder}
      width="sm:max-w-3xl"
      footer={
        <Button
          onClick={onClose}
          className="rounded-lg bg-gray-100 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
        >
          {t.common.close}
        </Button>
      }
    >
      <div
        dir={isRTLOrder ? "rtl" : "ltr"}
        className="space-y-6"
      >
        {/* Subtitle */}
        <div className="border-b pb-4">
          <p className="text-sm text-gray-500">
            <span className="font-medium">{tierName}</span>
            {" • "}
            <span>{workerName}</span>
          </p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t.invoice.bookingRef}
            </p>
            <p className="break-all text-sm font-medium text-gray-900">
              {booking._id ?? "-"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t.common.date}
            </p>
            <p className="text-sm font-medium text-gray-900">
              {bookingDate}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t.common.workedDuration}
            </p>
            <p className="text-sm font-medium text-gray-900">
              {duration}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t.common.totalPaid}
            </p>
            <p className="text-lg font-bold text-blue-600">
              {price}
            </p>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t.common["Work Description"]}
            </p>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm leading-6 text-gray-700">
                {booking.workDescription ?? "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </CommonModal>
  );
}