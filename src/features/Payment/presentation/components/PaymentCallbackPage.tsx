import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import { useLanguage } from "@/features/context/LanguageContext";
import { getSocket } from "@/features/core/Websocket/socket";
import { BookingEvents } from "@/components/common/BookingEvents";
import { useBookingById } from "@/features/Bookings/presentation/hooks/useBookingById";
 // <-- use your booking query hook

export default function PaymentCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const called = useRef(false);

  const bookingId = (location.state as { bookingId: string })?.bookingId;

  // Replace with your own booking details query
  const { booking } = useBookingById(bookingId);

  useEffect(() => {
    if (!bookingId) return;

    // If already paid before socket listener attached
    if (
      booking?.status === "PAID" ||
      booking?.status === "COMPLETED"
    ) {
      navigate("/jobcompleted", {
        replace: true,
        state: {
          bookingId,
          paymentDone: true,
        },
      });
    }
  }, [booking, bookingId, navigate]);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    if (!bookingId) {
      toast.error("Booking not found");
      navigate("/bookings", { replace: true });
      return;
    }

    const socket = getSocket();

    if (!socket) {
      toast.error("Socket not connected");
      navigate("/bookings", { replace: true });
      return;
    }

    const handleBookingUpdated = (data: any) => {
      console.log("============== SOCKET EVENT ==============");
      console.log("Event:", data.eventName);
      console.log("Booking:", data.bookingId);
      console.log("Expected:", bookingId);
      console.log("Payload:", data);

      if (data.bookingId !== bookingId) return;

      switch (data.eventName) {
        case BookingEvents.PAYMENT_INITIATED:
          console.log("PAYMENT_INITIATED");
          break;

        case BookingEvents.PAYMENT_COMPLETED:
        case BookingEvents.PAID:
          console.log("PAYMENT COMPLETED");

          toast.success(t.paymentpage.verified);

          socket.off("bookingUpdated", handleBookingUpdated);

          navigate("/jobcompleted", {
            replace: true,
            state: {
              bookingId,
              paymentDone: true,
            },
          });

          break;

        case BookingEvents.PAYMENT_FAILED:
          console.log("PAYMENT_FAILED");

          toast.error(t.paymentpage.failed);

          socket.off("bookingUpdated", handleBookingUpdated);

          navigate("/bookings", {
            replace: true,
          });

          break;

        default:
          console.log("Unhandled event:", data.eventName);
      }
    };

    socket.on("bookingUpdated", handleBookingUpdated);

    return () => {
      socket.off("bookingUpdated", handleBookingUpdated);
    };
  }, [bookingId, navigate, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md text-center">
        <CommonSpinner size={40} center />

        <h2 className="text-2xl font-bold mt-5">
          {t.common["Verifying Payment"]}
        </h2>

        <p className="text-gray-500 mt-2">
          {t.common["Please wait while we confirm your payment."]}
        </p>
      </div>
    </div>
  );
}