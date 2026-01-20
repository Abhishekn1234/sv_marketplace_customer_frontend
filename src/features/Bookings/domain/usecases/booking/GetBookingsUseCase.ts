import type { IBookingRepository } from "../../repositories/IBookingRepository";
import type { GetBookingsResponse } from "../../entities/getbookingresponse.types";

export class GetBookingsUseCase {
  private bookingRepository: IBookingRepository;

  constructor(bookingRepo: IBookingRepository) {
    this.bookingRepository = bookingRepo;
  }

  async execute(): Promise<GetBookingsResponse> {
    return this.bookingRepository.getBookings();
  }
}
