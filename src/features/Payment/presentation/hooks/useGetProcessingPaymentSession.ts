import { useQuery } from "@tanstack/react-query";
import { BookingPaymentImpl } from "../../data/repositories/BookingPaymentImpl";
import { GetProcessingPaymentSessionUsecase } from "../../domain/usecase/BookingPaymentUsecase";

export function useGetProcessingPaymentSession(bookingId?: string) {
  const repo = new BookingPaymentImpl();
  const usecase = new GetProcessingPaymentSessionUsecase(repo);

  return useQuery({
    queryKey: ["processing-payment-session", bookingId],
    queryFn: () => usecase.execute(bookingId!),
    enabled: !!bookingId,
    retry: false,
  });
}
