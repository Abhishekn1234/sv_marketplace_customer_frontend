import { useMutation } from "@tanstack/react-query";
import { GenerateOtpImplement } from "../../data/repositories/GenerateotpImpl";
import { GenerateotpCompleteUsecase } from "../../domain/usecase/Generateotpcompleteusecase";
import type { GenerateotpRequest } from "../../domain/entities/generateotprequest";
import { toast } from "react-toastify";

export function useGenerateOtpComplete() {
  const repo = new GenerateOtpImplement();
  const usecase = new GenerateotpCompleteUsecase(repo);

  return useMutation({
    mutationFn: (data: GenerateotpRequest) => usecase.execute(data),
    mutationKey: ["generate-otp"],
    onSuccess: (_data) => {
      // console.log("OTP generated successfully", data);
      // You can perform additional actions here
      toast.success("OTP generate successfully");
    },
    onError: (error) => {
      console.error("Failed to generate OTP", error);
      toast.error(error.message);
    },
  });
}