import apiClient from "@/features/api/interceptor";
import type { GenerateotpRequest } from "../../domain/entities/generateotprequest";
import type { GenerateOtp } from "../../domain/repositories/Generateotprepo";

export class GenerateOtpImplement implements GenerateOtp{
    async generateStartOtp(data:GenerateotpRequest):Promise<GenerateotpRequest>{
     const response=await apiClient.post('/booking/generate-start-otp',data);
    //  console.log(response);
     return response.data;
    }
    async generatecompleteOtp(data:GenerateotpRequest):Promise<GenerateotpRequest>{
        const response=await apiClient.post("/booking/generate-completion-otp",data);
        return response.data;
    }
    async generateotp(data: GenerateotpRequest): Promise<GenerateotpRequest> {
        const response = await apiClient.post('/booking/generate-otp', data);
        return response.data;
    }
}