import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { BookingPaymentVerifyRepositoryImpl } from "../../data/repositories/BookingPaymentVerifyImpl";
import { VerifyPaymentUseCase } from "../../domain/usecase/BookingPaymentVerifyUsecase";
import type { VerifyPaymentResponse } from "../../domain/entities/verifypayment";
import type { AxiosError } from "axios";

interface ApiError {
  message: string;
}

const repository = new BookingPaymentVerifyRepositoryImpl();
const useCase = new VerifyPaymentUseCase(repository);

export const useVerifyPayment = () => {
  return useMutation<VerifyPaymentResponse, AxiosError<ApiError>, string>({
    mutationFn: async (paymentId: string) => {
      return await useCase.execute({ paymentId });
    },

    onSuccess: (_data, paymentId) => {
      toast.success(`Payment Verified ✅ for paymentId: ${paymentId}`);
    },

    onError: (error, paymentId) => {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Unknown error";

      toast.error(`Failed to verify payment for ${paymentId}: ${msg}`);
    },
  });
};