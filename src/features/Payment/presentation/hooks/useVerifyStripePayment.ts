import { useQuery } from "@tanstack/react-query";

import { PaymentCallbackRepositoryImpl } from "../../data/repositories/PaymentCallbackRepositoryImpl";
import { VerifyStripePaymentUseCase } from "../../domain/usecase/VerifyStripePaymentUseCase";


export const useVerifyStripePayment = (
  paymentId?: string | null,
  status?: string | null,
  sessionId?: string | null
) => {
  return useQuery({
    queryKey: [
      "verify-stripe-payment",
      paymentId,
      status,
      sessionId,
    ],

    enabled: !!paymentId && !!status && !!sessionId,

    queryFn: async () => {
      const repository =
        new PaymentCallbackRepositoryImpl();

      const useCase =
        new VerifyStripePaymentUseCase(repository);

      return useCase.execute(
        paymentId!,
        status!,
        sessionId!
      );
    },

    retry: false,
    refetchOnWindowFocus: false,
  });
};