import { formatSmartDate } from "@/features/Confirmation/presentation/utils/formatdatetime";
import type { BookingHistory } from "../../domain/entities/bookinghistory.types";
import { formatBookingDuration } from "../utils/formatduration";
import Button from "@/components/input/Button";
import { useLanguage } from "@/features/context/LanguageContext";
import CommonModal from "@/components/common/CommonModal";
import { Hash, CalendarDays, Clock, Wallet, FileText, UserRound } from "lucide-react";

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
      <div dir={isRTLOrder ? "rtl" : "ltr"} className="space-y-6">
        {/* Subtitle */}
        <div className="flex items-center gap-2 border-b pb-4 text-sm text-gray-500">
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            {tierName}
          </span>
          <span className="flex items-center gap-1.5">
            <UserRound className="h-3.5 w-3.5" />
            {workerName}
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <DetailField
            icon={<Hash className="h-4 w-4" />}
            label={t.invoice.bookingRef}
            value={booking._id ?? "-"}
            valueClassName="break-all"
          />

          <DetailField
            icon={<CalendarDays className="h-4 w-4" />}
            label={t.common.date}
            value={bookingDate}
          />

          <DetailField
            icon={<Clock className="h-4 w-4" />}
            label={t.common.workedDuration}
            value={duration}
          />

          <DetailField
            icon={<Wallet className="h-4 w-4" />}
            label={t.common.totalPaid}
            value={price}
            valueClassName="text-lg font-bold text-blue-600"
          />

          <div className="space-y-2 sm:col-span-2">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <FileText className="h-3.5 w-3.5" />
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

function DetailField({
  icon,
  label,
  value,
  valueClassName = "text-sm font-medium text-gray-900",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {icon}
        {label}
      </p>
      <p className={valueClassName}>{value}</p>
    </div>
  );
}