import type { SendOTPResponse } from '../entities/sendotpresponse.types';
import type { OTPResponse } from '../entities/otpresponse.types';
import type { OTPRequest } from '../entities/otprequest.types';
import type { LoginResponse } from '../entities/loginresponse.types';
import type { ResetPasswordRequest } from '../entities/resetpasswordrequest.types';
import type { ForgotPasswordRequest } from '../entities/forgotpasswordrequest';
import type { RegisterResponse } from '../entities/registerresponse.types';
import type { LoginRequest } from '../entities/loginrequest.types';
import type { RegisterRequest } from '../entities/registerrequest';
import type { SendOTPRequest } from '../entities/sendotprequest.types';
export interface IAuthRepository {
  login(request: LoginRequest): Promise<LoginResponse>;
  register(request: RegisterRequest): Promise<RegisterResponse>;
  verifyOTP(request: OTPRequest): Promise<OTPResponse>;
  sendOTP(request: SendOTPRequest): Promise<SendOTPResponse>;
  forgotPassword(request: ForgotPasswordRequest): Promise<{ message: string }>;
  resetPassword(request: ResetPasswordRequest): Promise<{ message: string }>;
  logout(): Promise<void>;
  refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }>;
}
