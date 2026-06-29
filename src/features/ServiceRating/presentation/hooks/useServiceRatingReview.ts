import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import type { ServiceRatingReview } from "../../domain/entities/serviceratingreview";
import { ServiceReviewRepositoryImpl } from "../../data/repositories/ServiceRatingReviewImpl";
import { SubmitServiceReviewUseCase } from "../../domain/usecase/ServiceRatingReviewUsecase";
import { handleApiError } from "@/components/common/ApiError";

const repository = new ServiceReviewRepositoryImpl();
const submitReviewUseCase = new SubmitServiceReviewUseCase(repository);

export const useSubmitServiceReview = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<void, Error, ServiceRatingReview>({
    mutationFn: (review) => submitReviewUseCase.execute(review),

    onSuccess: (_, variables) => {
      toast.success("Review submitted successfully!");

      // update cache (optional)
      queryClient.invalidateQueries({
        queryKey: ["booking-review", variables.bookingId],
      });

      navigate("/");
    },

    onError: (error) => {
  handleApiError(error, "Failed to submit review");
},
  });
};