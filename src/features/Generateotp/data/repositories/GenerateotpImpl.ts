import apiClient from "@/features/api/interceptor";
import type { GenerateotpRequest } from "../../domain/entities/generateotprequest";
import type { GenerateOtp } from "../../domain/repositories/Generateotprepo";

export class GenerateOtpImplement implements GenerateOtp{
    async generateOtp(data:GenerateotpRequest):Promise<GenerateotpRequest>{
     const response=await apiClient.post('/booking/generate-start-otp',data);
     console.log(response);
     return response.data;
    }
}