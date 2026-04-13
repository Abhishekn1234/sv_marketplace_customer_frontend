import type { PaymentCallback } from "../entities/paymentcallback";
import type { VerifyPaymentResponse } from "../entities/verifypayment";
export interface IBookingPaymentVerifyRepository {
  verifyPayment(request:PaymentCallback ): Promise<VerifyPaymentResponse>;
}