import type { PaymentCallbackResponse } from "../entities/PaymentCallbackResponse";

export interface PaymentCallbackRepository {
  verifyStripePayment(
    paymentId: string,
    status: string,
    sessionId: string
  ): Promise<PaymentCallbackResponse>;
}