import {
  ReviewListResponse,
  ReviewQuery,
} from "../../domain/entities/review.types";

import { IReviewRepository } from "../../domain/repositories/review.repository";

export class GetMyReviewsUseCase {
  constructor(
    private repository: IReviewRepository
  ) {}

  execute(
    query: ReviewQuery
  ): Promise<ReviewListResponse> {
    return this.repository.getMyReviews(query);
  }
}