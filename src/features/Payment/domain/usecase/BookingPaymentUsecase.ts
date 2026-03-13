import type { PaymentInitial } from "../entities/intiatepayment";
import type { BookingPaymentRepo } from "../repositories/BookingPaymentRepo";

export class BookingPaymentUsecase{
    private bookingpayment:BookingPaymentRepo;
    constructor(bookingpay:BookingPaymentRepo){
        this.bookingpayment=bookingpay;
    }
    async execute(data:PaymentInitial){
        return this.bookingpayment.payment(data)
    }
}