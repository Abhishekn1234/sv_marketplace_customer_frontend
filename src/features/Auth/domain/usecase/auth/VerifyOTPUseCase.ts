import type { IAuthRepository } from '../../repositories/IAuthRepository';
import type { OTPRequest, OTPResponse } from '../../entities/auth.types';
import { useAuthStore } from '../../../../core/store/auth';

export class VerifyOTPUseCase {
  private authRepository: IAuthRepository;
  constructor(authrepo:IAuthRepository){
    this.authRepository=authrepo;
  }
  async execute(request: OTPRequest): Promise<OTPResponse> {
    // Validation
    if (!request.otp || request.otp.length !== 6) {
      throw new Error('Valid 6-digit OTP is required');
    }

    // Execute OTP verification
    const response = await this.authRepository.verifyOTP(request);

    // Store tokens if verification successful
    if (response.verified && response.accessToken && response.refreshToken && response.user) {
      const authStore = useAuthStore.getState();
      authStore.setTokens(response.accessToken, response.refreshToken);
      authStore.setUser(response.user);
    }

    return response;
  }
}
