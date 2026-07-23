

import {
  IReviewRepository,
} from "../../domain/repositories/review.repository";

import {
  ReviewListResponse,
  ReviewQuery,
} from "../../domain/entities/review.types";
import apiClient from "@/features/api/interceptor";

export class ReviewRepositoryImpl
  implements IReviewRepository
{
  async getMyReviews(
    query: ReviewQuery
  ): Promise<ReviewListResponse> {
    const response = await apiClient.get(
      "/booking/reviews",
      {
        params: query,
      }
    );
    // console.log(response);

    return response.data;
  }
}