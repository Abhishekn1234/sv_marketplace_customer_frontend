import type { VerifyOtpMobile } from "../entities/verifyotpmobile";
import type { IVerifyOtpMobileRepository } from "../repositories/VerifyOtpMobileRepo";

export class VerifyOtpMobileUseCase {
  private repo: IVerifyOtpMobileRepository;

  constructor(repo: IVerifyOtpMobileRepository) {
    this.repo = repo;
  }

  async execute(payload: VerifyOtpMobile): Promise<{ success: boolean; message: string }> {
    if (!payload.otp || !payload.hash) {
      throw new Error("OTP and hash are required");
    }
    return this.repo.verifyOtp(payload);
  }
}