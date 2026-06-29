import type { PaymentInitial, PaymentInitiationResponse } from "../entities/intiatepayment";
import type { BookingPaymentRepo } from "../repositories/BookingPaymentRepo";

export class BookingPaymentUsecase{
    private bookingpayment:BookingPaymentRepo;
    constructor(bookingpay:BookingPaymentRepo){
        this.bookingpayment=bookingpay;
    }
    async execute(data:PaymentInitial): Promise<PaymentInitiationResponse>{
        return this.bookingpayment.payment(data)
    }
}

export class GetProcessingPaymentSessionUsecase {
    private bookingpayment: BookingPaymentRepo;

    constructor(bookingpay: BookingPaymentRepo) {
        this.bookingpayment = bookingpay;
    }

    async execute(bookingId: string) {
        return this.bookingpayment.getProcessingPaymentSession(bookingId);
    }
}
