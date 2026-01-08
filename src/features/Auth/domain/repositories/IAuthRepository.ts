import {
  type LoginRequest,
  type LoginResponse,
  type RegisterRequest,
  type RegisterResponse,
  type OTPRequest,
  type OTPResponse,
  type SendOTPRequest,
  type SendOTPResponse,
  type ForgotPasswordRequest,
  type ResetPasswordRequest,
} from '../entities/auth.types';

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
