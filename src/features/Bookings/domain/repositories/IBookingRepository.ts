// src/repositories/IBookingRepository.ts
import type {
  Booking,
  BookingPayload,
 
  GetBookingsResponse,
  CancelBookingRequest,
} from "../entities/booking.types";

export interface IBookingRepository {
  createBooking(payload: BookingPayload): Promise<Booking>;
  getBookings(): Promise<GetBookingsResponse>;
  getBookingById(bookingId: string): Promise<Booking>;
  cancelBooking(request: CancelBookingRequest): Promise<Booking>;
  updateBookingStatus(bookingId: string, status: string): Promise<Booking>;
}
