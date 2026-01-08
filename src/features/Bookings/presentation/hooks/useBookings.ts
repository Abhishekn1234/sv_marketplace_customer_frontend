// src/hooks/useBookings.ts
import { useState, useEffect } from "react";
import { BookingRepository } from "../../data/repositories/BookingRepository";
import { CreateBookingUseCase } from "../../domain/usecases/booking/CreateBookingUseCase";
import { GetBookingsUseCase } from "../../domain/usecases/booking/GetBookingsUseCase";
import { CancelBookingUseCase } from "../../domain/usecases/booking/CancelBookingUseCase";
import type {
  Booking,
  BookingPayload,
  GetBookingsRequest,
  CancelBookingRequest,
} from "../../domain/entities/booking.types";

export const useBookings = (request?: GetBookingsRequest) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ single repository instance
  const bookingRepository = new BookingRepository();

  // ✅ use cases
  const getBookingsUseCase = new GetBookingsUseCase(bookingRepository);
  const createBookingUseCase = new CreateBookingUseCase(bookingRepository);
  const cancelBookingUseCase = new CancelBookingUseCase(bookingRepository);

  /**
   * FETCH BOOKINGS (for a particular user)
   */
  const fetchBookings = async (params?: GetBookingsRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getBookingsUseCase.execute(
        params || request!
      );

      setBookings(response.bookings);
      return response;
    } catch (err: any) {
      setError(err.message || "Failed to fetch bookings");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * CREATE BOOKING
   */
  const createBooking = async (payload: BookingPayload) => {
    try {
      setLoading(true);
      setError(null);

      const booking = await createBookingUseCase.execute(payload);

      // refresh bookings list
      if (request) {
        await fetchBookings(request);
      }

      return booking;
    } catch (err: any) {
      setError(err.message || "Failed to create booking");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * CANCEL BOOKING
   */
  const cancelBooking = async (request: CancelBookingRequest) => {
    try {
      setLoading(true);
      setError(null);

      const booking = await cancelBookingUseCase.execute(request);

      // refresh bookings list
      if (request) {
        await fetchBookings();
      }

      return booking;
    } catch (err: any) {
      setError(err.message || "Failed to cancel booking");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * AUTO FETCH ON MOUNT
   */
  useEffect(() => {
    if (request?.userId) {
      fetchBookings(request);
    }
  }, [request?.userId]);

  return {
    bookings,
    loading,
    error,
    createBooking,
    cancelBooking,
    refetch: fetchBookings,
  };
};
