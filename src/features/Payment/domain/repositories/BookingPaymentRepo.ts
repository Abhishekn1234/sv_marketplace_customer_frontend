import type { PaymentInitial, PaymentInitiationResponse } from "../entities/intiatepayment";
import type { ProcessingPaymentSession } from "../entities/processingpaymentsession";

export interface BookingPaymentRepo{
    payment(data:PaymentInitial):Promise<PaymentInitiationResponse>;
    getProcessingPaymentSession(bookingId:string):Promise<ProcessingPaymentSession | null>;
}
