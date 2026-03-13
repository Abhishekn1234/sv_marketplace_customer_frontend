import { useState } from "react";
import { VerifyOtpMobileImpl } from "../../data/repositories/VerifyOtpMobile";
import type { VerifyOtpMobile } from "../../domain/entities/verifyotpmobile";
import { VerifyOtpMobileUseCase } from "../../domain/usecase/SendOtpEmailUsecase";

export const useVerifyOtpMobile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repo = new VerifyOtpMobileImpl();
  const useCase = new VerifyOtpMobileUseCase(repo);

  const verifyOtp = async (payload: VerifyOtpMobile) => {
    setLoading(true);
    setError(null);
    try {
      const result = await useCase.execute(payload);
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message || "OTP verification failed");
      setLoading(false);
      throw err;
    }
  };

  return { verifyOtp, loading, error };
};