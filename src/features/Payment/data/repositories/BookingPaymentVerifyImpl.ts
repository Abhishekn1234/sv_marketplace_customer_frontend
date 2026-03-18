import type { IBookingPaymentVerifyRepository } from "../../domain/repositories/VerifyPaymentRepo";
import type { VerifyPaymentRequest, VerifyPaymentResponse } from "../../domain/entities/verifypayment";
import apiClient from "@/features/api/interceptor";

export class BookingPaymentVerifyRepositoryImpl implements IBookingPaymentVerifyRepository {
  async verifyPayment(request: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    try {
      const response = await apiClient.post("/booking/payment/verify-mock", request);

      // Use actual API response
      const data = response.data;

      // Example: API returns { success: boolean, message: string }
      if (!data.success) {
        throw new Error(data.message || "Payment verification failed");
      }

      return { success: true, message: data.message || "Payment Verified" };

    } catch (error: any) {
      const message = error?.response?.data?.message ?? error.message ?? "Payment verification failed";
      throw new Error(message);
    }
  }
}