import { useMutation } from "@tanstack/react-query";
import { GenerateOtpImplement } from "../../data/repositories/GenerateotpImpl";
import { GenerateOtpUsecase } from "../../domain/usecase/Generateotpusecase";
import type { GenerateotpRequest } from "../../domain/entities/generateotprequest";
import { toast } from "react-toastify";

export function useGenerateOtp() {
  const repo = new GenerateOtpImplement();   
  const usecase = new GenerateOtpUsecase(repo);

  return useMutation({
    mutationFn: (data: GenerateotpRequest) => usecase.execute(data),
    mutationKey: ["generateotp"],
    onSuccess: (data) => {
      console.log("OTP generated successfully", data);
      toast.success("OTP generated successfully");
    },
    onError: (error) => {
      console.error("OTP generation failed", error);
      toast.error("OTP generation failed");
    }
  });
}