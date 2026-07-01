import { useMemo } from "react";
import { useBookings } from "./useBookings";
import type { Booking } from "../../domain/entities/booking.types";

export const useBookingDetail = (id?: string) => {
  const { bookings, loading } = useBookings();

  const booking = useMemo(() => {
    if (!id) return undefined;

    if (!Array.isArray(bookings) || bookings.length === 0) {
      return undefined; // 👈 still loading data
    }

    return bookings.find((b: Booking) => b._id === id) as Booking | undefined;
  }, [bookings, id]);

  return {
    booking,
    loading,
  };
};