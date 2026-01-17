// data/repositories/CancelRepository.ts
import type { ICancelBookingRepository } from "../../domain/repositories/IBookingCancelRepository";
import type { CancelBookingRequest, Booking } from "../../domain/entities/booking.types";
import apiClient from "../../../api/interceptor";

export class CancelRepository implements ICancelBookingRepository {
  async cancelBooking(request: CancelBookingRequest): Promise<Booking> {
    const res = await apiClient.post("/booking/cancel", request);
    return res.data;
  }
}
