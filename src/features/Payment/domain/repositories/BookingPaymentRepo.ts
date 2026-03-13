import type { PaymentInitial } from "../entities/intiatepayment";

export interface BookingPaymentRepo{
    payment(data:PaymentInitial):Promise<any>;
}