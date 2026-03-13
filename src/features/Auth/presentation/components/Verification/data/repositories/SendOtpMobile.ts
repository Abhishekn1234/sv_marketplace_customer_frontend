import apiClient from "@/features/api/interceptor";
import type { SendOtpMobile } from "../../domain/entities/sendotpmobile";
import type { SendOtpMobileRepo } from "../../domain/repositories/SendOtpMobileRepo";

export class SendOtpMobileRepoImpl implements SendOtpMobileRepo {
  async sendOtpMobile(data: SendOtpMobile): Promise<{ message: string }> {
    try {
      const response = await apiClient.post('/auth/send-otp-mobile',data)
     
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}