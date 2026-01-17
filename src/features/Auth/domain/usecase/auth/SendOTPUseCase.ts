import type { IAuthRepository } from '../../repositories/IAuthRepository';
import type { SendOTPRequest, SendOTPResponse } from '../../entities/auth.types';

export class SendOTPUseCase {
  private authRepository: IAuthRepository;
    constructor(authrepo:IAuthRepository){
      this.authRepository=authrepo;
    }
  async execute(request: SendOTPRequest): Promise<SendOTPResponse> {
    // Validation
    if (!request.phone || request.phone.trim().length < 10) {
      throw new Error('Valid phone number is required');
    }

    // Execute send OTP
    return await this.authRepository.sendOTP(request);
  }
}
