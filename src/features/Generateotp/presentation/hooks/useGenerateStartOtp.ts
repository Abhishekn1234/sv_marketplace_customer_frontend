import { useMutation } from "@tanstack/react-query";
import { GenerateOtpImplement } from "../../data/repositories/GenerateotpImpl";
import { GenerateOtpUsecase } from "../../domain/usecase/Generatestartotpusecase";
import type { GenerateotpRequest } from "../../domain/entities/generateotprequest";
import { toast } from "react-toastify";
import { handleApiError } from "@/components/common/ApiError";

export function useGenerateStartOtp() {
  const repo = new GenerateOtpImplement();   
  const usecase = new GenerateOtpUsecase(repo);

  return useMutation({
    mutationFn: (data: GenerateotpRequest) => usecase.execute(data),
    mutationKey: ["generateotp"],
    onSuccess: (_data) => {
      // console.log("OTP generated successfully", data);
      toast.success("OTP generated successfully");
    },
    onError: (error:any) => {
      console.error("OTP generation failed", error);
      handleApiError(error);
    }
  });
}