
import type { BookingHistoryQueryParams, BookingHistoryResponse } from "../../entities/bookinghistory.types";
import type { IBookingRepository } from "../../repositories/IBookingRepository";

export class GetBookingHistoryUsecase{
    private getbookingusecase:IBookingRepository;

    constructor(getbooking:IBookingRepository){
        this.getbookingusecase=getbooking
    }
    async execute(params?:BookingHistoryQueryParams):Promise<BookingHistoryResponse>{
       return this.getbookingusecase.getBookingHistory(params)
    }
}