import type { BookingById } from "../../entities/bookingbyid.types";
import type { IBookingRepository } from "../../repositories/IBookingRepository";

export class GetBookingByIdUsecase{
    private bookingRepository: IBookingRepository;

    constructor(bookingRepository: IBookingRepository){
        this.bookingRepository=bookingRepository;
    }
    async execute(bookingId:string):Promise<BookingById>{
        return await this.bookingRepository.getBookingById(bookingId);
    }
}