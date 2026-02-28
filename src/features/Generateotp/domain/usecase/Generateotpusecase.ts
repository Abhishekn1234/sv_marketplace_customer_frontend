import type { GenerateotpRequest } from "../entities/generateotprequest";
import type { GenerateOtp } from "../repositories/Generateotprepo";

export class GenerateOtpUsecase{
    private Generateotp:GenerateOtp;
    constructor(generateotp:GenerateOtp){
         this.Generateotp=generateotp;
    }
    async execute(data:GenerateotpRequest){
        return this.Generateotp.generateOtp(data);
    }
}