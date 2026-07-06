import { formatSmartDate } from "@/features/Confirmation/presentation/utils/formatdatetime";
import type { BookingHistory } from "../../domain/entities/bookinghistory.types";
import { formatBookingDuration } from "../utils/formatduration";
import Button from "@/components/input/Button";
import { useLanguage } from "@/features/context/LanguageContext";
import CommonModal from "@/components/common/CommonModal";

import { BookingHistoryDetailField as DetailField } from "./BookingHistoryDetailField";
import { BookingHistoryCallableContact } from "./BookingHistoryCallableContact";
import { CalendarDaysIcon, ClockIcon, FileTextIcon, HashIcon, WalletIcon } from "@/components/icons";

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

  const customerName = booking.assignedWorkers?.[0]?.worker?.fullName ?? t.common["Not Assigned"];
  const customerPhone = booking.assignedWorkers?.[0]?.worker?.phone;

  const workerName =
    booking.assignedWorkers?.[0]?.worker?.fullName ?? t.common["Not Assigned"];
  const workerPhone = booking.assignedWorkers?.[0]?.worker?.phone;

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
          className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
        >
          {t.common.close}
        </Button>
      }
    >
      <div dir={isRTLOrder ? "rtl" : "ltr"} className="space-y-6">
        {/* Subtitle */}
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 pb-5">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 ring-1 ring-inset ring-blue-100">
            {tierName}
          </span>

         

          <span className="text-gray-300">•</span>

          <BookingHistoryCallableContact name={workerName} phone={workerPhone} />
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
            <DetailField
              icon={<HashIcon className="h-4 w-4" />}
              label={t.invoice.bookingRef}
              value={booking.bookingCode ?? "-"}
              valueClassName="break-all font-mono text-xs"
            />
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
            <DetailField
              icon={<CalendarDaysIcon className="h-4 w-4" />}
              label={t.common.date}
              value={bookingDate}
            />
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
            <DetailField
              icon={<ClockIcon className="h-4 w-4" />}
              label={t.common.workedDuration}
              value={duration}
            />
          </div>

          {/* Price gets its own visual weight since it's the number people scan for */}
          <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/60 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700/80">
              <WalletIcon className="h-4 w-4" />
              {t.common.totalPaid}
            </div>
            <span className="text-lg font-bold text-blue-700">{price}</span>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <FileTextIcon className="h-3.5 w-3.5" />
              {t.common["Work Description"]}
            </p>

            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
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