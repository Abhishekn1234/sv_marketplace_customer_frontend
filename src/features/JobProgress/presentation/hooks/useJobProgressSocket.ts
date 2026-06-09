"use client";

import { useEffect, useRef } from "react";
import { getSocket } from "@/features/core/Websocket/socket";

export function useSocketJobProgressActivities({
  bookingId,
  setLocalBooking,
}: any) {
  const lastEventId = useRef<string | null>(null);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !bookingId) return;

    const handler = (data: any) => {
      const eventBookingId = String(
        data?.bookingId || data?.booking?._id
      );

      if (eventBookingId !== String(bookingId)) return;

      // 🚫 prevent duplicate processing (same event replay)
      const eventId =
        data?.payload?._id ||
        data?.activity?._id ||
        data?.occurredAt;

      if (eventId && lastEventId.current === eventId) return;
      lastEventId.current = eventId;

      const booking = data.booking || {};
      const mappedStatus = data.status || booking?.status;

      setLocalBooking((prev: any) => {
        if (!prev) {
          return {
            ...booking,
            status: mappedStatus,
          };
        }

        // ✅ IMPORTANT: trust server booking.activities fully
        const mergedActivities =
          booking.activities ?? prev.activities ?? [];

        return {
          ...prev,
          ...booking, // snapshot wins

          status: mappedStatus ?? prev.status,

          // 🚫 DO NOT append manually
          activities: mergedActivities,
        };
      });
    };

    socket.on("bookingUpdated", handler);

    return () => {
      socket.off("bookingUpdated", handler);
    };
  }, [bookingId, setLocalBooking]);
}