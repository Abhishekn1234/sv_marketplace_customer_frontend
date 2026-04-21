import { useMemo } from "react";
import { useBookings } from "./useBookings";

export const useBookingById = (id?: string) => {
  const { bookings, loading } = useBookings();

  const booking = useMemo(() => {
    if (!id) return null;
    return bookings.find((b) => b._id === id) || null;
  }, [bookings, id]);

  return { booking, loading };
};