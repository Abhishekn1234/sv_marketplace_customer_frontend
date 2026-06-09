"use client";

import { useEffect } from "react";
import { getSocket } from "@/features/core/Websocket/socket";

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

      const booking = data.booking || {};
      const newActivity = data.activity;

      const mappedStatus =
        data.status || booking?.status;

      setLocalBooking((prev: any) => {
        if (!prev) {
          return {
            ...booking,
            status: mappedStatus,
          };
        }

        return {
          ...prev,

          // ✅ only update status if changed
          status: mappedStatus ?? prev.status,

          // ✅ merge booking fields safely
          ...booking,

          // ✅ CRITICAL FIX: merge activities instead of overwrite
          activities: newActivity
            ? [
                ...(prev.activities || []),
                newActivity,
              ]
            : prev.activities || [],
        };
      });
    };

    socket.on("bookingUpdated", handler);

    return () => {
      socket.off("bookingUpdated", handler);
    };
  }, [bookingId, setLocalBooking]);
}