import apiClient, { publicApiClient } from '../../../api/interceptor';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  OTPRequest,
  OTPResponse,
  SendOTPRequest,
  SendOTPResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ForgotPasswordResponse
} from '../../domain/entities/auth.types';

export class AuthRepository {
  private readonly baseUrl = '/auth';

  async login(request: LoginRequest): Promise<LoginResponse> {
    const res = await apiClient.post<LoginResponse>(`${this.baseUrl}/login`, request);
    return res.data;
  }

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const res = await apiClient.post<RegisterResponse>(`${this.baseUrl}/register`, request);
    return res.data;
  }

  async sendOTP(request: SendOTPRequest): Promise<SendOTPResponse> {
    const res = await apiClient.post<SendOTPResponse>(`${this.baseUrl}/send-otp-email`, request);
    return res.data;
  }

 async verifyOTP(request: OTPRequest): Promise<OTPResponse> {
  const res = await apiClient.post<OTPResponse>(
    `${this.baseUrl}/verify-otp`,
    request
  );
  if (res.data?.accessToken) {
      const customerData = {
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken
      };
      localStorage.setItem('accessTokens', res.data.accessToken);
      localStorage.setItem('resetpassword', JSON.stringify(customerData));
    }
  return res.data;
}


 async forgotPassword(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  const response = await apiClient.post<ForgotPasswordResponse>(
    `${this.baseUrl}/send-otp-email`,
    request
  );
  return response.data;
}


  async resetPassword(request: ResetPasswordRequest): Promise<{ message: string }> {
    const token = localStorage.getItem('accessTokens'); // get token saved after OTP
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await publicApiClient.post(`${this.baseUrl}/reset-password`, request, { headers });
    return res.data;
  }


  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const res = await apiClient.post(`${this.baseUrl}/refresh-token`, { refreshToken });
    return res.data;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('customerData');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

export default new AuthRepository();
