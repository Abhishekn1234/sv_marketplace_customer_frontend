import type { GenerateotpRequest } from "../entities/generateotprequest";

export interface GenerateOtp{
    generateOtp:(data:GenerateotpRequest)=>Promise<GenerateotpRequest>
}