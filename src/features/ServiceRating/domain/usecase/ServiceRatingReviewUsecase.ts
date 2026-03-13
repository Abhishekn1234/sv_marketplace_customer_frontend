import type { ServiceRatingReview } from "../entities/serviceratingreview";
import type { ServiceReviewRepository } from "../repositories/ServiceRatingReviewRepo";

export class SubmitServiceReviewUseCase {
  private repository: ServiceReviewRepository;

  constructor(repository: ServiceReviewRepository) {
    this.repository = repository;
  }

  execute(review: ServiceRatingReview): Promise<void> {
    return this.repository.submitReview(review);
  }
}