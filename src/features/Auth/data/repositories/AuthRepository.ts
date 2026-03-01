import apiClient, { publicApiClient } from "../../../api/interceptor";
import { useAuthStore } from "../../../core/store/auth";

import type {SendOTPResponse} from "../../domain/entities/sendotpresponse.types";
import type { OTPResponse } from "../../domain/entities/otpresponse.types";
import type { OTPRequest } from "../../domain/entities/otprequest.types";
import type { LoginResponse } from "../../domain/entities/loginresponse.types";
import type { ResetPasswordRequest } from "../../domain/entities/resetpasswordrequest.types";
import type { ForgotPasswordRequest } from "../../domain/entities/forgotpasswordrequest";
import type { ForgotPasswordResponse } from "../../domain/entities/forgotpasswordresponse";
import type { RegisterResponse } from "../../domain/entities/registerresponse.types";
import type { LoginRequest } from "../../domain/entities/loginrequest.types";
import type { RegisterRequest } from "../../domain/entities/registerrequest";
import type { SendOTPRequest } from "../../domain/entities/sendotprequest.types";
class AuthRepository {
  private readonly baseUrl = "/auth";

 

 async login(request: LoginRequest): Promise<LoginResponse> {
  const res = await apiClient.post<LoginResponse>(
    `${this.baseUrl}/login`,
    request
  );

  return res.data; 
}



  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const res = await apiClient.post<RegisterResponse>(
      `${this.baseUrl}/register`,
      request
    );
    return res.data;
  }


  async sendOTP(request: SendOTPRequest): Promise<SendOTPResponse> {
    const res = await apiClient.post<SendOTPResponse>(
      `${this.baseUrl}/send-otp-email`,
      request
    );
    return res.data;
  }


  async verifyOTP(request: OTPRequest): Promise<OTPResponse> {
    const res = await apiClient.post<OTPResponse>(
      `${this.baseUrl}/verify-otp`,
      request
    );

    if (res.data?.accessToken && res.data?.refreshToken) {
      useAuthStore.getState().setTokens(
        res.data.accessToken,
        res.data.refreshToken
      );
    }

    return res.data;
  }

  

  async forgotPassword(
    request: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    const res = await apiClient.post<ForgotPasswordResponse>(
      `${this.baseUrl}/send-otp-email`,
      request
    );
    return res.data;
  }


  async resetPassword(
    request: ResetPasswordRequest
  ): Promise<{ message: string }> {
    const token =
      useAuthStore.getState().accessToken;

    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await publicApiClient.post(
      `${this.baseUrl}/reset-password`,
      request,
      { headers }
    );

    return res.data;
  }


  async refreshToken(): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const refreshToken =
      useAuthStore.getState().refreshToken;

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const res = await apiClient.post(
      `${this.baseUrl}/refresh-token`,
      { refreshToken }
    );

    const {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    } = res.data;

    useAuthStore
      .getState()
      .setTokens(newAccessToken, newRefreshToken);

    return res.data;
  }



  async logout(): Promise<void> {
    useAuthStore.getState().clearAuth();
  }
}

export default new AuthRepository();
