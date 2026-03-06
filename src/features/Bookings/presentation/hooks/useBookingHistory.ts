import { useInfiniteQuery } from "@tanstack/react-query";
import BookingRepository from "../../data/repositories/BookingRepository";
import { GetBookingHistoryUsecase } from "../../domain/usecases/booking/GetBookingHistoryUsecase";
import type {
  BookingHistoryResponse,
  BookingHistoryQueryParams,
} from "../../domain/entities/bookinghistory.types";

export function useBookingHistory(params?: BookingHistoryQueryParams) {
  const usecase = new GetBookingHistoryUsecase(BookingRepository);

  return useInfiniteQuery<BookingHistoryResponse, Error>({
    queryKey: ["booking-history", params],
queryFn: ({ pageParam = 1 }) =>
  usecase.execute({
    ...params,
    page: pageParam as number,
  }),

    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasNextPage) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },

    initialPageParam: 1,
  });
}