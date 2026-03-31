import { useLanguage } from "@/features/context/LanguageContext";
import type { BookingHistory } from "../../domain/entities/bookinghistory.types";

interface BookingActionsProps {
  booking: BookingHistory;
  label: string;
  clickable: boolean;
  onActionClick: () => void;
  onViewDetails: () => void;
  onPayNow: () => void;
  onCheckProgress: () => void;
  onInvoiceClick: () => void;
   navigatetodispute: (booking: BookingHistory) => void;
}

export function BookingActions({
  booking,
  label,
  clickable,
  onActionClick,
  onViewDetails,
  onPayNow,
  onCheckProgress,
  navigatetodispute
//   onInvoiceClick,
}: BookingActionsProps) {
  const {t}=useLanguage();
  const shouldShowButtons = !(
    booking.status === "PAID" &&
    booking.updatedAt &&
    new Date().getTime() - new Date(booking.updatedAt).getTime() >
      1000 * 60 * 60 * 24 * 10
  );

  if (!shouldShowButtons) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-end items-center gap-2 w-full sm:w-auto">
      <button
        onClick={onActionClick}
        className={`px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 transition ${
          !clickable ? "cursor-not-allowed opacity-60" : ""
        }`}
        disabled={!clickable}
      >
        {label}
      </button>

      {["IN_PROGRESS", "COMPLETED", "WORK_COMPLETED_PENDING", "REQUESTED"].includes(
        booking.status
      ) && (
        <button
          onClick={onCheckProgress}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition"
        >
         
         {t.Bookingspage.Actions.checkProgress}
        </button>
      )}

    
      <button
        onClick={() => {
          if (booking.status === "COMPLETED" && !booking.invoiceId) {
            onPayNow();
          } else {
            onViewDetails();
          }
        }}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        {booking.status === "COMPLETED" && !booking.invoiceId ? t.Bookingspage.Actions.payNow : t.Bookingspage.Actions.viewDetails}
      </button>
      <button
          onClick={() => navigatetodispute(booking)}
          className="
            px-4 py-2 
            rounded-lg 
            text-sm font-medium 
            bg-red-600 text-white 
            hover:bg-red-700 
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 
            transition 
            shadow-sm 
            whitespace-nowrap
          "
        >
          {t.Bookingspage.Actions["Create Dispute"]}
        </button>
    </div>
  );
}