import type { ServiceRatingReview } from "../../domain/entities/serviceratingreview";
import type { ServiceReviewRepository } from "../../domain/repositories/ServiceRatingReviewRepo";
import apiClient from "@/features/api/interceptor";
export class ServiceReviewRepositoryImpl implements ServiceReviewRepository {
  async submitReview(review: ServiceRatingReview): Promise<void> {
    try {
      await apiClient.post("/booking/review", review);
    } catch (error) {
      console.error("Error submitting review:", error);
      throw error;
    }
  }
}