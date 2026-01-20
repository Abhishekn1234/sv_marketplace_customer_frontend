
import type {
  Booking,

 


} from "../entities/booking.types";
import type { CancelBookingRequest } from "../entities/cancelbookingrequest.types";
import type { GetBookingsResponse } from "../entities/getbookingresponse.types";
import type { BookingPayload } from "../entities/bookingpayload.types";
export interface IBookingRepository {
  createBooking(payload: BookingPayload): Promise<Booking>;
  getBookings(): Promise<GetBookingsResponse>;
  getBookingById(bookingId: string): Promise<Booking>;
  cancelBooking(request: CancelBookingRequest): Promise<Booking>;
  updateBookingStatus(bookingId: string, status: string): Promise<Booking>;
}
