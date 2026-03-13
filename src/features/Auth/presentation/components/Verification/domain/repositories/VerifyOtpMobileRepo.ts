import type { VerifyOtpMobile } from "../entities/verifyotpmobile";

export interface IVerifyOtpMobileRepository {
  verifyOtp(payload: VerifyOtpMobile): Promise<{ success: boolean; message: string }>;
}