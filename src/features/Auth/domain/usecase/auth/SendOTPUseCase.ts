import type { IAuthRepository } from '../../Auth/domain/repositories/IAuthRepository';
import type { SendOTPRequest, SendOTPResponse } from '../../features/types/auth.types';

export class SendOTPUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(request: SendOTPRequest): Promise<SendOTPResponse> {
    // Validation
    if (!request.phone || request.phone.trim().length < 10) {
      throw new Error('Valid phone number is required');
    }

    // Execute send OTP
    return await this.authRepository.sendOTP(request);
  }
}
