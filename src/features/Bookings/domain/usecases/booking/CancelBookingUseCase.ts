
import type { ICancelBookingRepository } from "../../repositories/IBookingCancelRepository";
import type {  Booking } from "../../entities/booking.types";
import type { CancelBookingRequest } from "../../entities/cancelbookingrequest.types";
import { validatecancelbooking } from "../../validations/cancelbookingvalidation";
export class CancelBookingUseCase {
  private cancelRepo: ICancelBookingRepository;
  constructor(cancelRepo: ICancelBookingRepository) {
    this.cancelRepo = cancelRepo;
  }

  async execute(request: CancelBookingRequest): Promise<Booking> {
    validatecancelbooking(request);
    return await this.cancelRepo.cancelBooking(request);
  }
}
