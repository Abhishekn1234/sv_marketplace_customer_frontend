import apiClient from "@/features/api/interceptor";
import type { VerifyOtpMobile } from "../../domain/entities/verifyotpmobile";
import type { IVerifyOtpMobileRepository } from "../../domain/repositories/VerifyOtpMobileRepo";
import { handleApiError } from "@/components/common/ApiError";

export class VerifyOtpMobileImpl implements IVerifyOtpMobileRepository {
  private baseUrl = "/auth/verify-otp-mobile";

  async verifyOtp(
    payload: VerifyOtpMobile
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post(this.baseUrl, payload);

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (err) {
      handleApiError(err);
      throw err; // ✅ satisfies TypeScript
    }
  }
}