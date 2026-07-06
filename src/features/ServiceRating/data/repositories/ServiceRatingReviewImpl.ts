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
   async getMyReviewByBookingId(
    bookingId: string
  ): Promise<ServiceRatingReview> {
    const res = await apiClient.get(`/booking/review/${bookingId}`);
    // if (!res.status.toString().startsWith("2")) {
    //     if (res.status === 404) {
    //       throw new Error("Review not found");
    //     }
    //     if (res.status === 401) {
    //       throw new Error("Unauthorized");
    //     }
    //     throw new Error("Failed to fetch booking review");
    //   }
  
      return res.data as ServiceRatingReview;
  }

}