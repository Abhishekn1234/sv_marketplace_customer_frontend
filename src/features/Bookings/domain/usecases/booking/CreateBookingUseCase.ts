
import type { IBookingRepository } from "../../repositories/IBookingRepository";
import type { Booking } from "../../entities/booking.types";
import type { BookingPayload } from "../../entities/bookingpayload.types";
import { validateCreateBooking } from "../../validations/creatingbookingvalidation";
export class CreateBookingUseCase {
  private Bookingrepo:IBookingRepository;
  constructor(bookrepo:IBookingRepository){
    this.Bookingrepo=bookrepo
  }

  async execute(payload: BookingPayload): Promise<Booking> {
    

     validateCreateBooking(payload);

   
    return await this.Bookingrepo.createBooking(payload);
  }
}
