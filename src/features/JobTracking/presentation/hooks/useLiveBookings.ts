import { useEffect, useState } from "react";
import { getSocket, initializeSocket } from "@/features/core/Websocket/socket";
import { useAuthStore } from "@/features/core/store/auth";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";

export function useLiveBooking(initial: Booking[]) {
  const [bookings, setBookings] = useState<Booking[]>(initial);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (accessToken) initializeSocket(accessToken);
  }, [accessToken]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (_event: string, data: any) => {
      if (!data.bookingId) return;

      setBookings((prev) =>
        prev.map((b) =>
          b._id === data.bookingId
            ? { ...b, status: data.status, ...data }
            : b
        )
      );
    };

    socket.onAny(handler);

    return () => {
      socket.offAny(handler);
    };
  }, []);

  return bookings;
}