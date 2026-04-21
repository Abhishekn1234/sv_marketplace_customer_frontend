
import { toast } from "react-toastify";
import { BookingPaymentVerifyRepositoryImpl } from "../../data/repositories/BookingPaymentVerifyImpl";
import { VerifyPaymentUseCase } from "../../domain/usecase/BookingPaymentVerifyUsecase";
import type { VerifyPaymentResponse } from "../../domain/entities/verifypayment";
import type { AxiosError } from "axios";
import type { PaymentCallback } from "../../domain/entities/paymentcallback";
import { useQueryClient, useMutation } from "@tanstack/react-query";
interface ApiError {
  message: string;
}

const repository = new BookingPaymentVerifyRepositoryImpl();
const useCase = new VerifyPaymentUseCase(repository);

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

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

  // -------------------------
  // 1️⃣ UPDATE SINGLE BOOKING
  // -------------------------
  queryClient.setQueryData(
    ["bookings", variables.bookingId],
    (oldData: any) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        paymentStatus: "PAID",
        status: "PAID",
        invoice: {
          ...oldData.invoice,
          status: "PAID",
        },
      };
    }
  );

  // -------------------------
  // 2️⃣ UPDATE BOOKING LIST
  // -------------------------
  queryClient.setQueryData(["booking-history"], (oldData: any) => {
    if (!oldData) return oldData;

    return oldData.map((booking: any) => {
      if (booking._id !== variables.bookingId) return booking;

      return {
        ...booking,
        paymentStatus: "PAID",
        status: "PAID",
        invoice: {
          ...booking.invoice,
          status: "PAID",
        },
      };
    });
  });
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