import apiClient from "@/features/api/interceptor";

import type { PaymentCallbackResponse } from "../../domain/entities/PaymentCallbackResponse";
import type { PaymentCallbackRepository } from "../../domain/repositories/PaymentCallbackRepository";

export class PaymentCallbackRepositoryImpl
  implements PaymentCallbackRepository
{
  async verifyStripePayment(
    paymentId: string,
    status: string,
    sessionId: string
  ): Promise<PaymentCallbackResponse> {
    const response = await apiClient.get(
      "/booking/payment/stripe/callback",
      {
        params: {
          paymentId,
          status,
          session_id: sessionId,
        },
      }
    );

    return response.data;
  }
}