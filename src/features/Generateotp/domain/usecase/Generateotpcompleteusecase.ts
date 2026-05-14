import type { GenerateotpRequest } from "../entities/generateotprequest";
import type { GenerateOtp } from "../repositories/Generateotprepo";

export class GenerateotpCompleteUsecase{
    private generatecompleteotp:GenerateOtp;
    constructor(generateotp:GenerateOtp){
        this.generatecompleteotp=generateotp;
    }
    async execute(data:GenerateotpRequest){
        return this.generatecompleteotp.generateotp(data)
    }
}