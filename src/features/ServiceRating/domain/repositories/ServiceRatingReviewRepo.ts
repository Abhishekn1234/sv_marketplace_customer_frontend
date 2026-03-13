import type { ServiceRatingReview } from "../entities/serviceratingreview";

export interface ServiceReviewRepository {
  submitReview(review: ServiceRatingReview): Promise<void>;
}