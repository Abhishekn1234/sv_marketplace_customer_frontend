"use client";

import { useEffect } from "react";
import { getSocket } from "@/features/core/Websocket/socket";

// function mapEventToActivityType(eventName: string) {
//   const map: Record<string, string> = {
//     "booking.created": "CREATED",
//     "booking:update": "UPDATED",
//     "booking.worker.accepted": "WORKER_ACCEPTED",
//     "booking.work-start-otp.generated": "WORK_START_OTP_GENERATED",
//     "booking.work.started": "WORK_STARTED",
//     "booking.work.completed-by-worker": "WORK_COMPLETED_BY_WORKER",
//     "booking.completion-otp.generated": "COMPLETION_OTP_GENERATED",
//     "booking.completion.confirmed": "COMPLETED",
//     "booking.invoice.generated": "INVOICE_GENERATED",
//     "booking.cancelled.worker": "WORKER_CANCELLED",
//     "booking.customer.cancelled": "CUSTOMER_CANCELLED",
//   };

//   return map[eventName] || eventName;
// }

export function useSocketJobProgressActivities({
  bookingId,
  setLocalBooking,
}: any) {
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !bookingId) return;

    const handler = (data: any) => {
      console.log("📡 Socket Event:", data);

      const eventBookingId = String(
        data?.bookingId || data?.booking?._id
      );

      if (eventBookingId !== String(bookingId)) return;

      const booking = data.booking;

      const mappedStatus =
        data.status || booking?.status;

      const updatedBooking = {
        ...booking,
        status: mappedStatus,
        activities:
          booking?.activities || [],
      };

      // 🔥 ALWAYS FULL REPLACE (NO PATCH LOGIC)
      setLocalBooking((prev: any) => {
        if (!prev) return updatedBooking;

        return {
          ...prev,
          ...updatedBooking,
          status: updatedBooking.status,
          activities: updatedBooking.activities,
        };
      });
    };

    // ⚡ ONLY ONE SOURCE EVENT (IMPORTANT FIX)
    socket.on("bookingUpdated", handler);

    return () => {
      socket.off("bookingUpdated", handler);
    };
  }, [bookingId, setLocalBooking]);
}