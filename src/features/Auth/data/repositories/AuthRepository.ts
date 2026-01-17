import apiClient, { publicApiClient } from "../../../api/interceptor";
import { useAuthStore } from "../../../core/store/auth";

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
  ForgotPasswordResponse,
} from "../../domain/entities/auth.types";

class AuthRepository {
  private readonly baseUrl = "/auth";

  /* ---------------- LOGIN ---------------- */

 async login(request: LoginRequest): Promise<LoginResponse> {
  const res = await apiClient.post<LoginResponse>(
    `${this.baseUrl}/login`,
    request
  );

  return res.data; // 🚀 ONLY return data
}


  /* ---------------- REGISTER ---------------- */

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const res = await apiClient.post<RegisterResponse>(
      `${this.baseUrl}/register`,
      request
    );
    return res.data;
  }

  /* ---------------- SEND OTP ---------------- */

  async sendOTP(request: SendOTPRequest): Promise<SendOTPResponse> {
    const res = await apiClient.post<SendOTPResponse>(
      `${this.baseUrl}/send-otp-email`,
      request
    );
    return res.data;
  }

  /* ---------------- VERIFY OTP ---------------- */

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

  /* ---------------- FORGOT PASSWORD ---------------- */

  async forgotPassword(
    request: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    const res = await apiClient.post<ForgotPasswordResponse>(
      `${this.baseUrl}/send-otp-email`,
      request
    );
    return res.data;
  }

  /* ---------------- RESET PASSWORD ---------------- */

  async resetPassword(
    request: ResetPasswordRequest
  ): Promise<{ message: string }> {
    const token =
      useAuthStore.getState().customerData.accessToken;

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

  /* ---------------- REFRESH TOKEN ---------------- */

  async refreshToken(): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const refreshToken =
      useAuthStore.getState().customerData.refreshToken;

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

  /* ---------------- LOGOUT ---------------- */

  async logout(): Promise<void> {
    useAuthStore.getState().clearAuth();
  }
}

export default new AuthRepository();
