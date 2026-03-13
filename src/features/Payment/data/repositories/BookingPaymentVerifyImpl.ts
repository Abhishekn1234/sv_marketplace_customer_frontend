import type { IBookingPaymentVerifyRepository } from "../../domain/repositories/VerifyPaymentRepo";
import type { VerifyPaymentRequest, VerifyPaymentResponse } from "../../domain/entities/verifypayment";
import apiClient from "@/features/api/interceptor";

export class BookingPaymentVerifyRepositoryImpl implements IBookingPaymentVerifyRepository {
  async verifyPayment(request: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    try {
      const response = await apiClient.post("/booking/payment/verify-mock", request);

      // ✅ Throw if HTTP status is not 2xx
      if (response.status !== 200) {
        throw new Error(response.data?.message || "Payment verification failed");
      }

      // Only return success if the request was OK
      return { success: true, message: "Payment Verified" };

    } catch (error: any) {
      // ✅ Throw error instead of returning an object
      const message = error?.response?.data?.message ?? error.message ?? "Payment verification failed";
      throw new Error(message);
    }
  }
}