// src/usecases/booking/CancelBookingUseCase.ts
import type { IBookingRepository } from "../../repositories/IBookingRepository";
import type { CancelBookingRequest, Booking } from "../../entities/booking.types";

export class CancelBookingUseCase {
 private cancelrepo:IBookingRepository;
 constructor(Cancelrepo:IBookingRepository){
  this.cancelrepo=Cancelrepo
 }

  async execute(request: CancelBookingRequest): Promise<Booking> {
    /**
     * VALIDATION
     */
    if (!request.bookingId || request.bookingId.trim().length === 0) {
      throw new Error("Booking ID is required");
    }

    /**
     * EXECUTE REPOSITORY
     */
    return await this.cancelrepo.cancelBooking(request);
  }
}
