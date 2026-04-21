"use client";

import { useEffect } from "react";
import { getSocket } from "@/features/core/Websocket/socket";

// 🔥 map socket event → activity type
function mapEventToActivityType(eventName: string) {
  const map: any = {
    "booking.created": "CREATED",
    "booking:update": "UPDATED",
    "booking.worker.accepted": "WORKER_ACCEPTED",
    "booking.work-start-otp.generated": "WORK_START_OTP_GENERATED",
    "booking.work.started": "WORK_STARTED",
    "booking.work.completed-by-worker": "WORK_COMPLETED_BY_WORKER",
    "booking.completion-otp.generated": "COMPLETION_OTP_GENERATED",
    "booking.completion.confirmed": "COMPLETED",
    "booking.invoice.generated": "INVOICE_GENERATED",
  };

  return map[eventName] || eventName;
}

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

      // ❌ ignore other bookings
      if (eventBookingId !== String(bookingId)) return;

      setLocalBooking((prev: any) => {
        if (!prev) return prev;

        // ✅ CASE 1: backend sends full booking + activities
        if (data.booking?.activities) {
          return {
            ...prev,
            ...data.booking,
            activities: data.booking.activities,
          };
        }

        // ✅ CASE 2: only event → create activity manually
        const newActivity = {
          _id: `${data.eventName}-${Date.now()}`, // temp unique id
          type: mapEventToActivityType(data.eventName),
          createdAt:
            data.occurredAt || new Date().toISOString(),
        };

        return {
          ...prev,
          ...data.booking,
          status: data.status || prev.status,

          // ✅ append activity safely
          activities: [
            ...(prev.activities || []),

            // prevent duplicate same type
            ...(prev.activities?.some(
              (a: any) => a.type === newActivity.type
            )
              ? []
              : [newActivity]),
          ],
        };
      });
    };

    // 🔥 all events
    const events = [
      "booking.created",
      "booking:update",
      "booking.worker.accepted",
      "booking.work-start-otp.generated",
      "booking.work.started",
      "booking.work.completed-by-worker",
      "booking.completion-otp.generated",
      "booking.completion.confirmed",
      "booking.invoice.generated",
    ];

    events.forEach((event) => socket.on(event, handler));

    return () => {
      events.forEach((event) => socket.off(event, handler));
    };
  }, [bookingId, setLocalBooking]);
}