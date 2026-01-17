// domain/repositories/ICancelBookingRepository.ts
import type { CancelBookingRequest } from "../entities/booking.types";
import type { Booking } from "../entities/booking.types";

export interface ICancelBookingRepository {
  cancelBooking(request: CancelBookingRequest): Promise<Booking>;
}

