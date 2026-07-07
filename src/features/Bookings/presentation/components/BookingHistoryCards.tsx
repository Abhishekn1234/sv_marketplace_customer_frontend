"use client";

import CommonCard from "@/components/common/CommonCards";

import { useNavigate } from "react-router-dom";

import type { BookingHistory } from "../../domain/entities/bookinghistory.types";
import type { BookingStatus } from "../../domain/entities/bookingstatus.types";
import { getBookingButtonConfig } from "../utils/bookingstatusbuttonmap";
import { formatStatus } from "../../../../components/utils/formatstatusmap";
import { statusStyles } from "../utils/statusmap";
import { BookingActions } from "./BookingHistoryActions";

import type { PaymentCallback } from "@/features/Payment/domain/entities/paymentcallback";

import { useLanguage } from "@/features/context/LanguageContext";
import { HomeIcon } from "@/components/icons";
import { formatDates } from "@/components/utils/formatdates";
import { formatDuration } from "@/components/utils/formatduration";

interface BookingCardProps {
  booking: BookingHistory;
  onViewDetails: (booking: BookingHistory) => void;
  onPayNow: (bookingId: string) => void;
  onGenerateStartOtp: (bookingId: string) => void;
  onGenerateCompletedOtp: (bookingId: string) => void;
  onInvoiceClick: (booking: BookingHistory) => void;
  onVerifyPayment: (data: PaymentCallback) => void;
}

export default function BookingCard({
  booking,
  onViewDetails,
  onGenerateStartOtp,
  onGenerateCompletedOtp,
  onInvoiceClick,
  onVerifyPayment,
}: BookingCardProps) {
  const navigate = useNavigate();
  const { label, clickable } = getBookingButtonConfig(booking);

  const { t, isRTLOrder } = useLanguage();

 const handleActionButtonClick = () => {
  if (!clickable) return;

  switch (booking.status) {
    case "REQUESTED":
    case "IN_PROGRESS":
    case "WORKER_ACCEPTED":
    case "WORK_COMPLETED_PENDING":
      navigate(`/jobtracking/${booking._id}`);
      break;

    case "INVOICE_GENERATED":
      onInvoiceClick(booking);
      break;

    case "PAYMENT_PENDING":
      if (booking?.paymentId) {
        onVerifyPayment({
          bookingId: booking._id,
          paymentId: booking.paymentId,
          status: "SUCCESS",
          sessionId: booking.sessionId,
        });
      }
      break;

    case "PAID":
      navigate(`/servicerating/${booking._id}`);
      break;

    default:
      break;
  }
};
  return (
    <CommonCard className="w-full max-w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-3 sm:flex-1 sm:gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 sm:h-14 sm:w-14">
            <HomeIcon className="h-5 w-5 text-blue-600 sm:h-7 sm:w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="break-words text-[14px] font-semibold text-gray-900 sm:truncate sm:text-[16px]">
              {booking.service?.name ?? "Service Name"}
            </h3>
            <p className="break-words text-xs text-gray-500 sm:truncate sm:text-sm">
              {booking.serviceTier?.displayName ?? "Tier"} •{" "}
              {booking.assignedWorkers?.[0]?.worker?.fullName ?? "Not assigned"}
            </p>
          </div>
        </div>

        <span
          className={`inline-block w-fit shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide sm:px-3 sm:text-xs ${
            statusStyles[booking.status as BookingStatus]
          }`}
        >
          {formatStatus(booking.status as BookingStatus)}
        </span>
      </div>

      {/* Info */}
      <div className="mb-5 grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-4 sm:grid-cols-3 sm:gap-4">
        <div className="min-w-0">
          <span className="text-xs text-gray-500">{t.common.date}</span>
          <p
            dir={isRTLOrder ? "ltr" : undefined}
            className="break-words text-sm font-semibold sm:truncate sm:text-base"
          >
            {formatDates(booking.schedule?.startDateTime)}
          </p>
        </div>

        <div className="min-w-0">
          <span className="text-xs text-gray-500">
            {t.confirmationpage.bookingSummary.duration}
          </span>
          <p
            dir={isRTLOrder ? "ltr" : undefined}
            className="break-words text-sm font-semibold sm:truncate sm:text-base"
          >
            {formatDuration(booking)}
          </p>
        </div>

        <div className="min-w-0">
          <span className="text-xs text-gray-500">{t.paymentpage.bookingId}</span>
          <p className="break-words text-sm font-semibold sm:truncate sm:text-base">
            {booking.bookingCode}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <BookingActions
        booking={booking}
        label={label}
        clickable={clickable}
        onActionClick={handleActionButtonClick}
        onViewDetails={() => onViewDetails(booking)}
        onPayNow={() => {
          const finalPrice = booking?.totalCost;
          const serviceName =booking?.service?.name
          navigate("/payment", {
            state: {
              bookingId: booking._id,
              taxableAmount:booking.estimatedValues?.taxableAmount??booking.actualValues?.taxableAmount,
              bookingCode:booking.bookingCode,
              vatAmount:booking.estimatedValues?.vatAmount??booking.actualValues?.vatAmount,
              serviceName: serviceName,
              price: Number(finalPrice).toFixed(2),
              currency: booking.currency ?? "SAR",
            },
          });
        }}
        onCheckProgress={() => navigate(`/jobprogress/${booking._id}`)}
        onInvoiceClick={() => onInvoiceClick(booking)}
        navigatetodispute={(booking) => navigate(`/dispute/${booking._id}`)}
      />
    </CommonCard>
  );
}