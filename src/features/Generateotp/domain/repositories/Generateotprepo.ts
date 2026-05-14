import type { GenerateotpRequest } from "../entities/generateotprequest";

export interface GenerateOtp{
    generateStartOtp:(data:GenerateotpRequest)=>Promise<GenerateotpRequest>
    generateotp:(data: GenerateotpRequest) => Promise<GenerateotpRequest>;
    generatecompleteOtp:(data:GenerateotpRequest)=>Promise<GenerateotpRequest>
}