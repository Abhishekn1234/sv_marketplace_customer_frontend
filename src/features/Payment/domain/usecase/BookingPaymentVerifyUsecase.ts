import type { IBookingPaymentVerifyRepository } from "../repositories/VerifyPaymentRepo";
import type { VerifyPaymentResponse } from "../entities/verifypayment";
import type { PaymentCallback } from "../entities/paymentcallback";

export class VerifyPaymentUseCase {

  private repo: IBookingPaymentVerifyRepository;

  constructor(repo: IBookingPaymentVerifyRepository) {
    this.repo = repo; 
  }

  
  async execute(request: PaymentCallback): Promise<VerifyPaymentResponse> {
    return this.repo.verifyPayment(request);
  }
}