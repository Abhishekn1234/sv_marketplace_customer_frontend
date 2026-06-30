import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { BookingPaymentImpl } from "../../data/repositories/BookingPaymentImpl";
import { GetProcessingPaymentSessionUsecase } from "../../domain/usecase/BookingPaymentUsecase";



export function useGetProcessingPaymentSession(
  bookingId?: string,
  options?: Omit<
    UseQueryOptions<any>,
    "queryKey" | "queryFn"
  >
) {
  const repo = new BookingPaymentImpl();
  const usecase = new GetProcessingPaymentSessionUsecase(repo);

  return useQuery({
    queryKey: ["processing-payment-session", bookingId],
    queryFn: () => usecase.execute(bookingId!),
    enabled: false,
    retry: false,
    ...options,
  });
}
