import { useMemo } from "react";
import { useBookings } from "./useBookings";

export const useBookingDetail = (id?: string) => {
  const { bookings, loading } = useBookings();

  const booking = useMemo(() => {
    if (!id) return undefined;

    if (!Array.isArray(bookings) || bookings.length === 0) {
      return undefined; // 👈 still loading data
    }

    return bookings.find((b) => b._id === id || b._id === id);
  }, [bookings, id]);

  return {
    booking,
    loading,
  };
};