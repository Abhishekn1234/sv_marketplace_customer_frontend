import type { IAuthRepository } from '../../repositories/IAuthRepository';
import type {  OTPResponse } from '../../entities/otpresponse.types';
import type { OTPRequest } from '../../entities/otprequest.types';
import { useAuthStore } from '../../../../core/store/auth';
import { validateOTP } from '../../validations/authvalidation';

export class VerifyOTPUseCase {
  private authRepository: IAuthRepository;
  constructor(authrepo:IAuthRepository){
    this.authRepository=authrepo;
  }
  async execute(request: OTPRequest): Promise<OTPResponse> {
   
   validateOTP(request.otp);


    const response = await this.authRepository.verifyOTP(request);


    if (response.verified && response.accessToken && response.refreshToken && response.user) {
      const authStore = useAuthStore.getState();
      authStore.setTokens(response.accessToken, response.refreshToken);
      authStore.setUser(response.user);
    }

    return response;
  }
}
