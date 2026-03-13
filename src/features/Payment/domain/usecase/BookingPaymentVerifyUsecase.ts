import type { IBookingPaymentVerifyRepository } from "../repositories/VerifyPaymentRepo";
import type { VerifyPaymentRequest,VerifyPaymentResponse } from "../entities/verifypayment";

export class VerifyPaymentUseCase {

  private repo: IBookingPaymentVerifyRepository;

  constructor(repo: IBookingPaymentVerifyRepository) {
    this.repo = repo; 
  }

  
  async execute(request: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    return this.repo.verifyPayment(request);
  }
}