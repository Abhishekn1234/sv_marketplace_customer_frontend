import type { IAuthRepository } from '../../repositories/IAuthRepository';
import type {  SendOTPResponse } from '../../entities/sendotpresponse.types';
import type { SendOTPRequest } from '../../entities/sendotprequest.types';
export class SendOTPUseCase {
  private authRepository: IAuthRepository;
    constructor(authrepo:IAuthRepository){
      this.authRepository=authrepo;
    }
  async execute(request: SendOTPRequest): Promise<SendOTPResponse> {
    
    if (!request.phone || request.phone.trim().length < 10) {
      throw new Error('Valid phone number is required');
    }

    return await this.authRepository.sendOTP(request);
  }
}
