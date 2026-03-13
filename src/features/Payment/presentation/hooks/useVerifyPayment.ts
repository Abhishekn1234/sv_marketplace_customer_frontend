import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { BookingPaymentVerifyRepositoryImpl } from "../../data/repositories/BookingPaymentVerifyImpl";
import { VerifyPaymentUseCase } from "../../domain/usecase/BookingPaymentVerifyUsecase";
import type { VerifyPaymentResponse } from "../../domain/entities/verifypayment";
import type { AxiosError } from "axios";

const repository = new BookingPaymentVerifyRepositoryImpl();
const useCase = new VerifyPaymentUseCase(repository);

export const useVerifyPayment = () => {
  return useMutation<VerifyPaymentResponse, AxiosError, string>({
    mutationFn: async (paymentId: string) => {
      return await useCase.execute({ paymentId });
    },
    onSuccess: (_data, paymentId) => {
  toast.success(`Payment Verified ✅ for paymentId: ${paymentId}`);
},
   onError: (error, paymentId) => {
  // Safe extraction of error message
  let msg = "Unknown error";

  // If AxiosError, response?.data?.message might exist
  if ((error as any)?.response?.data?.message) {
    msg = (error as any).response.data.message;
  } else if ((error as any)?.message) {
    msg = (error as any).message;
  }

  toast.error(`Failed to verify payment for ${paymentId}: ${msg}`);
},
  });
};