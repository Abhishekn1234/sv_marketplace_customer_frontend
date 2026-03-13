import apiClient from "@/features/api/interceptor";
import type { VerifyOtpMobile } from "../../domain/entities/verifyotpmobile";
import type { IVerifyOtpMobileRepository } from "../../domain/repositories/VerifyOtpMobileRepo";

export class VerifyOtpMobileImpl implements IVerifyOtpMobileRepository {
  private baseUrl = "/auth/verify-otp-mobile"; 

  async verifyOtp(payload: VerifyOtpMobile): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post(this.baseUrl, payload);
      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "OTP verification failed");
    }
  }
}