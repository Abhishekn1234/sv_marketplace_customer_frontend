// src/usecases/booking/GetBookingsUseCase.ts
import type { IBookingRepository } from "../../repositories/IBookingRepository";
import type { GetBookingsRequest, GetBookingsResponse } from "../../entities/booking.types";

export class GetBookingsUseCase {
  private  bookingRepository: IBookingRepository

  constructor(bookingRepo:IBookingRepository){
    this.bookingRepository=bookingRepo
  }

  async execute(request: GetBookingsRequest): Promise<GetBookingsResponse> {
    /**
     * VALIDATION
     */
    if (!request.userId || request.userId.trim().length === 0) {
      throw new Error("User ID is required to fetch bookings");
    }

    /**
     * EXECUTE REPOSITORY
     */
    return await this.bookingRepository.getBookings(request);
  }
}
