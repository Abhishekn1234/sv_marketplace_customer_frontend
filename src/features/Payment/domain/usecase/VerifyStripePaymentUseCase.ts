import type { PaymentCallbackRepository } from "../repositories/PaymentCallbackRepository";

export class VerifyStripePaymentUseCase {
  constructor(
    private paymentRepository: PaymentCallbackRepository
  ) {}

  async execute(
    paymentId: string,
    status: string,
    sessionId: string
  ) {
    return this.paymentRepository.verifyStripePayment(
      paymentId,
      status,
      sessionId
    );
  }
}