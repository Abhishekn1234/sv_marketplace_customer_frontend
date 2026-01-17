// domain/usecases/booking/CancelBookingUseCase.ts
import type { ICancelBookingRepository } from "../../repositories/IBookingCancelRepository";
import type { CancelBookingRequest, Booking } from "../../entities/booking.types";

export class CancelBookingUseCase {
  private cancelRepo: ICancelBookingRepository;
  constructor(cancelRepo: ICancelBookingRepository) {
    this.cancelRepo = cancelRepo;
  }

  async execute(request: CancelBookingRequest): Promise<Booking> {
    if (!request.bookingId) throw new Error("Booking ID is required");
    return await this.cancelRepo.cancelBooking(request);
  }
}
