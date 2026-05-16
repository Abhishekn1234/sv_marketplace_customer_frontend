import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookingPaymentImpl } from "../../data/repositories/BookingPaymentImpl";
import { BookingPaymentUsecase } from "../../domain/usecase/BookingPaymentUsecase";
import type { PaymentInitial } from "../../domain/entities/intiatepayment";

export function useBookingPayment() {
  const repo = new BookingPaymentImpl();
  const usecase = new BookingPaymentUsecase(repo);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PaymentInitial) => usecase.execute(data),
    mutationKey: ["bookingpayment"],

    onSuccess: (_response, variables) => {
      const bookingId = variables.bookingId;
      // console.log(response);
      // ✅ Update ALL booking-history caches (any params)
      queryClient.setQueriesData(
        { queryKey: ["booking-history"], exact: false }, // 🔥 KEY FIX
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.map((booking: any) =>
                booking._id === bookingId
                  ? {
                      ...booking,
                      status: "PAYMENT_PENDING",
                    }
                  : booking
              ),
            })),
          };
        }
      );

    //   // ✅ Keep backend sync
    //   queryClient.invalidateQueries({
    //     queryKey: ["booking-history"],
    //     exact: false,
    //   });
    },
  });
}