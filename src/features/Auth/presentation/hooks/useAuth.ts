import { useState } from 'react';
import AuthRepository from '../../data/repositories/AuthRepository';
import type  {
  LoginRequest,
  RegisterRequest,
  OTPRequest,
  SendOTPRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '../../domain/entities/auth.types';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (req: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      const res = await AuthRepository.login(req);

      // Save tokens
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      localStorage.setItem('customerData', JSON.stringify(res));

      return res;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (req: RegisterRequest) => {
    try {
      setLoading(true);
      const res = await AuthRepository.register(req);
      return res;
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = (req: SendOTPRequest) => AuthRepository.sendOTP(req);
  const verifyOTP = (req: OTPRequest) => AuthRepository.verifyOTP(req);
  const forgotPassword = (req: ForgotPasswordRequest) => AuthRepository.forgotPassword(req);
  const resetPassword = (req: ResetPasswordRequest) => AuthRepository.resetPassword(req);

  const logout = async () => {
    await AuthRepository.logout();
    window.location.href = '/login';
  };

  return {
    login,
    register,
    sendOTP,
    verifyOTP,
    forgotPassword,
    resetPassword,
    logout,
    loading,
    error
  };
};
