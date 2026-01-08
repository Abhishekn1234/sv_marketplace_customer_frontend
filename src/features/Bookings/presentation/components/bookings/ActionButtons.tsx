import { useState } from "react";
import { InvoiceModal } from "./InvoiceModal";
import { CancelBookingModal } from "./CancelBookingModal";
import { MessageProviderModal } from "./MessageProviderModal";
import type { Booking } from "../../../domain/entities/booking.types";

interface ActionButtonsProps {
  booking: Booking;
  onCancelBooking?: (bookingId: string, reason: string) => Promise<boolean>;
  onMessageProvider?: (message: string) => Promise<boolean>;
}

export const ActionButtons = ({
  booking,
  onCancelBooking,
  onMessageProvider,
}: ActionButtonsProps) => {
  const [showInvoice, setShowInvoice] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-4">
  {/* View Invoice */}
  <button
    onClick={() => setShowInvoice(true)}
    className="
      inline-flex items-center justify-center
      px-6 py-3
      rounded-xl
      bg-blue-600 text-white
      font-semibold
      shadow-sm
      transition-all duration-200
      hover:bg-blue-700 hover:shadow-md
      active:scale-95
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    "
  >
    View Invoice
  </button>

  {/* Message Provider */}
  <button
    onClick={() => setShowMessageModal(true)}
    className="
      inline-flex items-center justify-center
      px-6 py-3
      rounded-xl
      border border-gray-300
      bg-white text-gray-800
      font-semibold
      shadow-sm
      transition-all duration-200
      hover:bg-gray-50 hover:shadow-md
      active:scale-95
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    "
  >
    Message Provider
  </button>

  {/* Cancel Booking */}
  {booking.status === "REQUESTED" && (
    <button
      onClick={() => setShowCancelModal(true)}
      className="
        inline-flex items-center justify-center
        px-6 py-3
        rounded-xl
        border border-red-300
        bg-red-50 text-red-700
        font-semibold
        shadow-sm
        transition-all duration-200
        hover:bg-red-100 hover:shadow-md
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
      "
    >
      Cancel Booking
    </button>
  )}
</div>


      {showInvoice && (
        <InvoiceModal booking={booking} onClose={() => setShowInvoice(false)} />
      )}

      {showCancelModal && (
        <CancelBookingModal
          bookingId={booking._id}
          onCancel={onCancelBooking}
          onClose={() => setShowCancelModal(false)}
        />
      )}

      {showMessageModal && (
        <MessageProviderModal
          providerId={booking._id}
          onSend={onMessageProvider}
          onClose={() => setShowMessageModal(false)}
        />
      )}
    </>
  );
};
