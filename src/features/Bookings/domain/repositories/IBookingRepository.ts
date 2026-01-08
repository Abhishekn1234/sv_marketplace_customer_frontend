// src/repositories/IBookingRepository.ts
import type {
  Booking,
  BookingPayload,
  GetBookingsRequest,
  GetBookingsResponse,
  CancelBookingRequest,
} from "../entities/booking.types";

export interface IBookingRepository {
  createBooking(payload: BookingPayload): Promise<Booking>;
  getBookings(request: GetBookingsRequest): Promise<GetBookingsResponse>;
  getBookingById(bookingId: string): Promise<Booking>;
  cancelBooking(request: CancelBookingRequest): Promise<Booking>;
  updateBookingStatus(bookingId: string, status: string): Promise<Booking>;
}
