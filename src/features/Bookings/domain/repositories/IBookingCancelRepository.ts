
import type { CancelBookingRequest } from "../entities/cancelbookingrequest.types";
import type { Booking } from "../entities/booking.types";

export interface ICancelBookingRepository {
  cancelBooking(request: CancelBookingRequest): Promise<Booking>;
}

