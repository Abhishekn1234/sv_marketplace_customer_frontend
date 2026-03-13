import type { VerifyPaymentRequest,VerifyPaymentResponse } from "../entities/verifypayment";
export interface IBookingPaymentVerifyRepository {
  verifyPayment(request: VerifyPaymentRequest): Promise<VerifyPaymentResponse>;
}