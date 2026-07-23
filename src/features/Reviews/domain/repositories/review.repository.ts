import {
  ReviewListResponse,
  ReviewQuery,
} from "../entities/review.types";

export interface IReviewRepository {
  getMyReviews(
    query: ReviewQuery
  ): Promise<ReviewListResponse>;
}