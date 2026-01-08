import type { IAuthRepository } from '../../Auth/domain/repositories/IAuthRepository';
import type { OTPRequest, OTPResponse } from '../../features/types/auth.types';

export class VerifyOTPUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(request: OTPRequest): Promise<OTPResponse> {
    // Validation
    

    if (!request.otp || request.otp.length !== 6) {
      throw new Error('Valid 6-digit OTP is required');
    }

    // Execute OTP verification
    const response = await this.authRepository.verifyOTP(request);

    // Store tokens if verification successful
    if (response.verified && response.token && response.user) {
      localStorage.setItem('accessToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('isAuthenticated', 'true');
    }

    return response;
  }
}
