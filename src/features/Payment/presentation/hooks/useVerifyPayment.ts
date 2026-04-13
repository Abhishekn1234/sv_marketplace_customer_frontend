import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { BookingPaymentVerifyRepositoryImpl } from "../../data/repositories/BookingPaymentVerifyImpl";
import { VerifyPaymentUseCase } from "../../domain/usecase/BookingPaymentVerifyUsecase";
import type { VerifyPaymentResponse } from "../../domain/entities/verifypayment";
import type { AxiosError } from "axios";
import type { PaymentCallback } from "../../domain/entities/paymentcallback";

interface ApiError {
  message: string;
}

const repository = new BookingPaymentVerifyRepositoryImpl();
const useCase = new VerifyPaymentUseCase(repository);

export const useVerifyPayment = () => {
  return useMutation<
    VerifyPaymentResponse,
    AxiosError<ApiError>,
    PaymentCallback
  >({
    mutationFn: async (data: PaymentCallback) => {
      return await useCase.execute(data);
    },

    onSuccess: (_data, variables) => {
      toast.success(`Payment Verified ✅ for paymentId: ${variables.paymentId}`);
    },

    onError: (error, variables) => {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Unknown error";

      toast.error(
        `Failed to verify payment for ${variables.paymentId}: ${msg}`
      );
    },
  });
};