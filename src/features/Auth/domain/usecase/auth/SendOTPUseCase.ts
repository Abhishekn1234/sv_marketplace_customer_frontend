import type { IAuthRepository } from '../../repositories/IAuthRepository';
import type {  SendOTPResponse } from '../../entities/sendotpresponse.types';
import type { SendOTPRequest } from '../../entities/sendotprequest.types';
import { validatePhone } from '../../validations/authvalidation';
export class SendOTPUseCase {
  private authRepository: IAuthRepository;
    constructor(authrepo:IAuthRepository){
      this.authRepository=authrepo;
    }
  async execute(request: SendOTPRequest): Promise<SendOTPResponse> {
    
   validatePhone(request.phone);

    return await this.authRepository.sendOTP(request);
  }
}
