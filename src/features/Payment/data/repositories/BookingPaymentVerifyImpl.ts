import type { IBookingPaymentVerifyRepository } from "../../domain/repositories/VerifyPaymentRepo";
import type {  VerifyPaymentResponse } from "../../domain/entities/verifypayment";
import apiClient from "@/features/api/interceptor";
import type { PaymentCallback } from "../../domain/entities/paymentcallback";
import type { AxiosError } from "axios";

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

    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ??
        (error instanceof Error ? error.message : "Payment verification failed");
      throw new Error(message);
    }
  }
}
