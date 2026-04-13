import type { IBookingPaymentVerifyRepository } from "../../domain/repositories/VerifyPaymentRepo";
import type {  VerifyPaymentResponse } from "../../domain/entities/verifypayment";
import apiClient from "@/features/api/interceptor";
import type { PaymentCallback } from "../../domain/entities/paymentcallback";

export class BookingPaymentVerifyRepositoryImpl implements IBookingPaymentVerifyRepository {
  async verifyPayment(request: PaymentCallback): Promise<VerifyPaymentResponse> {
    try {
      const response = await apiClient.post("/booking/payment/callback", request);

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