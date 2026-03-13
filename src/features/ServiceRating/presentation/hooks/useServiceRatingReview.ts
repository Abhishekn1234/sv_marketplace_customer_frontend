import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { ServiceRatingReview } from "../../domain/entities/serviceratingreview";
import { ServiceReviewRepositoryImpl } from "../../data/repositories/ServiceRatingReviewImpl";
import { SubmitServiceReviewUseCase } from "../../domain/usecase/ServiceRatingReviewUsecase";
import { useNavigate } from "react-router-dom";
const repository = new ServiceReviewRepositoryImpl();
const submitReviewUseCase = new SubmitServiceReviewUseCase(repository);

export const useSubmitServiceReview = () => {
    const navigate=useNavigate();
  return useMutation<void, unknown, ServiceRatingReview>({
    mutationFn: (review) => submitReviewUseCase.execute(review),
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      navigate('/');
      
    },
    onError: () => {
      toast.error("Failed to submit review. Please try again.");
    },
  });
};