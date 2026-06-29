import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { BookingPaymentVerifyRepositoryImpl } from "../../data/repositories/BookingPaymentVerifyImpl";
import { VerifyPaymentUseCase } from "../../domain/usecase/BookingPaymentVerifyUsecase";
import type { VerifyPaymentResponse } from "../../domain/entities/verifypayment";
import type { PaymentCallback } from "../../domain/entities/paymentcallback";

const repository = new BookingPaymentVerifyRepositoryImpl();
const useCase = new VerifyPaymentUseCase(repository);

type BookingCacheItem = {
  _id?: string;
  paymentStatus?: string;
  status?: string;
  invoice?: {
    status?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type PaginatedBookingCache = {
  data?: BookingCacheItem[];
  [key: string]: unknown;
};

const markBookingPaid = (booking: BookingCacheItem): BookingCacheItem => ({
  ...booking,
  paymentStatus: "PAID",
  status: "PAID",
  invoice: {
    ...booking.invoice,
    status: "PAID",
  },
});

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    VerifyPaymentResponse,
    Error,
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
        (old: BookingCacheItem | undefined) => {
          if (!old) return old;

          return markBookingPaid(old);
        }
      );

      // =========================
      // UPDATE BOOKING HISTORY CACHE
      // =========================
      queryClient.setQueryData(["booking-history"], (old: unknown) => {
        if (!old) return old;

        if (Array.isArray(old)) {
          return old.map((booking: BookingCacheItem) =>
            booking._id === variables.bookingId
              ? markBookingPaid(booking)
              : booking
          );
        }

        // Handles paginated response:
        // { data: Booking[], total, page, ... }
        const paginatedOld = old as PaginatedBookingCache;
        if (paginatedOld.data && Array.isArray(paginatedOld.data)) {
          return {
            ...paginatedOld,
            data: paginatedOld.data.map((booking) =>
              booking._id === variables.bookingId
                ? markBookingPaid(booking)
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
        error.message ??
          `Failed to verify payment for ${variables.paymentId}`
      );
    },
  });
};
