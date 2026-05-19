import { useQuery } from "@tanstack/react-query";
import { ServiceReviewRepositoryImpl } from "../../data/repositories/ServiceRatingReviewImpl";
import { GetServiceRatingReviewUseCase } from "../../domain/usecase/GetServiceRatingReviewUsecase";

const repo = new ServiceReviewRepositoryImpl();
const useCase = new GetServiceRatingReviewUseCase(repo);

export const useBookingReview = (bookingId?: string) => {
  return useQuery({
    queryKey: ["booking-review", bookingId],

    queryFn: async () => {
      if (!bookingId) return null;
      return await useCase.execute(bookingId);
    },

    enabled: !!bookingId,

    select: (res) => res ?? null,

    staleTime: 1000 * 60 * 5,
  });
};