"use client";

import { useLanguage } from "@/features/context/LanguageContext";
import type { BookingHistory } from "../../domain/entities/bookinghistory.types";
import type { BookingStatus } from "../../domain/entities/bookingstatus.types";
import Button from "@/components/input/Button";

/* =========================
   ✅ PROPS
========================= */
interface BookingActionsProps {
  booking: BookingHistory;
  label: string;
  clickable: boolean;
  onActionClick: () => void;
  onViewDetails: () => void;
  onPayNow: (data: {
  bookingId: string;
  serviceName: string;
  price: number;
  currency: string;
}) => void;
  onCheckProgress: () => void;
  onInvoiceClick: () => void;
  navigatetodispute: (booking: BookingHistory) => void;
}

/* =========================
   ✅ COMPONENT
========================= */


/* =========================
   COMPONENT
========================= */

/* =========================
   COMPONENT
========================= */
export function BookingActions({
  booking,
  label,
  clickable,
  onActionClick,
  onViewDetails,
  onPayNow,
  onCheckProgress,
  navigatetodispute,
}: BookingActionsProps) {
  const { t, isRTLOrder } = useLanguage();

  const status = booking.status as BookingStatus;

  const isOlderThan10Days = booking.updatedAt
    ? Date.now() - new Date(booking.updatedAt).getTime() >
      1000 * 60 * 60 * 24 * 10
    : false;

  const shouldShowButtons = !(status === "PAID" && isOlderThan10Days);

  if (!shouldShowButtons) return null;

  const isExpired = status === "EXPIRED";

  const shouldPayNow =
    !isExpired &&
    (status === "COMPLETED" || status === "INVOICE_GENERATED");

  const TRACKABLE_STATUSES: BookingStatus[] = [
    "IN_PROGRESS",
    "COMPLETED",
    "WORK_COMPLETED_PENDING",
    "REQUESTED",
  ];

  const canTrack =
    !isExpired && TRACKABLE_STATUSES.includes(status);

  const canDispute =
    status && status.toUpperCase() !== "REFUNDED";

  const showPrimaryAction = !isExpired;

  return (
    <div
      className={`
        flex flex-col sm:flex-row
        justify-end items-center gap-2
        w-full sm:w-auto
        ${isRTLOrder ? "sm:flex-row-reverse" : ""}
      `}
    >

      {/* Primary Action */}
      {showPrimaryAction && (
        <Button
          onClick={onActionClick}
          variant="ghost"
          className={`px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-black hover:bg-gray-50 transition ${
            !clickable ? "cursor-not-allowed opacity-60" : ""
          }`}
          disabled={!clickable}
        >
          {label}
        </Button>
      )}

      {/* Track Progress */}
      {canTrack && (
        <Button
          onClick={onCheckProgress}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition"
        >
          {t.Bookingspage.Actions.checkProgress}
        </Button>
      )}

      {/* Pay Now / View Details */}
      <Button
        onClick={() => {
          if (shouldPayNow) {
            onPayNow({
              bookingId: booking._id,
              serviceName: booking.service?.name ?? "Service",
              price: booking?.totalCost ?? 0,
              currency: booking.currency ?? "SAR",
            });
          } else {
            onViewDetails();
          }
        }}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:text-blue-200 hover:bg-blue-700 transition"
      >
        {shouldPayNow
          ? t.Bookingspage.Actions.payNow
          : t.Bookingspage.Actions.viewDetails}
      </Button>

      {/* Dispute */}
      {canDispute && (
        <Button
          onClick={() => navigatetodispute(booking)}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition shadow-sm whitespace-nowrap"
        >
          {t.Bookingspage.Actions["Create Dispute"]}
        </Button>
      )}
    </div>
  );
}