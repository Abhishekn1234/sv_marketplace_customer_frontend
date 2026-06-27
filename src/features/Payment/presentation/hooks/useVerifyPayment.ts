import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { BookingPaymentVerifyRepositoryImpl } from "../../data/repositories/BookingPaymentVerifyImpl";
import { VerifyPaymentUseCase } from "../../domain/usecase/BookingPaymentVerifyUsecase";
import type { VerifyPaymentResponse } from "../../domain/entities/verifypayment";
import type { PaymentCallback } from "../../domain/entities/paymentcallback";

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
    mutationFn: (data) => useCase.execute(data),

    onSuccess: (_response, variables) => {
      toast.success("Payment Verified ✅");

      // =========================
      // UPDATE SINGLE BOOKING CACHE
      // =========================
      queryClient.setQueryData(
        ["bookings", variables.bookingId],
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            paymentStatus: "PAID",
            status: "PAID",
            invoice: {
              ...old.invoice,
              status: "PAID",
            },
          };
        }
      );

      // =========================
      // UPDATE BOOKING HISTORY CACHE
      // =========================
      queryClient.setQueryData(["booking-history"], (old: any) => {
        if (!old) return old;

        if (Array.isArray(old)) {
          return old.map((booking: any) =>
            booking._id === variables.bookingId
              ? {
                  ...booking,
                  paymentStatus: "PAID",
                  status: "PAID",
                  invoice: {
                    ...booking.invoice,
                    status: "PAID",
                  },
                }
              : booking
          );
        }

        // Handles paginated response:
        // { data: Booking[], total, page, ... }
        if (old.data && Array.isArray(old.data)) {
          return {
            ...old,
            data: old.data.map((booking: any) =>
              booking._id === variables.bookingId
                ? {
                    ...booking,
                    paymentStatus: "PAID",
                    status: "PAID",
                    invoice: {
                      ...booking.invoice,
                      status: "PAID",
                    },
                  }
                : booking
            ),
          };
        }

        return old;
      });

      // Optional: invalidate other related queries
      // queryClient.invalidateQueries({ queryKey: ["wallet"] });
      // queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    onError: (error, variables) => {
      toast.error(
        error.response?.data?.message ??
          `Failed to verify payment for ${variables.paymentId}`
      );
    },
  });
};