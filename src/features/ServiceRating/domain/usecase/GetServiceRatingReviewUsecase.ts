import type { ServiceReviewRepository } from "../repositories/ServiceRatingReviewRepo";

export class GetServiceRatingReviewUseCase {
  constructor(
    private repo: ServiceReviewRepository
  ) {}

  execute(bookingId: string) {
    return this.repo.getMyReviewByBookingId(bookingId);
  }
}