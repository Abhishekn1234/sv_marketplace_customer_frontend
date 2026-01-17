import { useAuthStore } from '../../../core/store/auth';
import { useMutation } from '@tanstack/react-query';
import AuthRepository from '../../data/repositories/AuthRepository';
import { toast } from 'react-toastify';
import type {
  LoginRequest,
  RegisterRequest,
  OTPRequest,
  SendOTPRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '../../domain/entities/auth.types';

export const useAuth = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  /* ---------------- Login ---------------- */
  const loginMutation = useMutation({
    mutationFn: async (req: LoginRequest) => {
      const res = await AuthRepository.login(req);

      // Save tokens and user to store
      setTokens(res.accessToken, res.refreshToken);
      setUser(res.user);

      return res;
    },
    onSuccess: (res) => {
      toast.success(res.message || 'Login successful ✅');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Login failed ❌');
    },
  });

  /* ---------------- Register ---------------- */
  const registerMutation = useMutation({
    mutationFn: (req: RegisterRequest) => AuthRepository.register(req),
    onSuccess: (res: any) => {
      toast.success(res?.message || 'Registration successful ✅');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Registration failed ❌');
    },
  });

  /* ---------------- Send OTP ---------------- */
  const sendOTPMutation = useMutation({
    mutationFn: (req: SendOTPRequest) => AuthRepository.sendOTP(req),
    onSuccess: (res: any) => {
      toast.success(res?.message || 'OTP sent successfully ✅');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to send OTP ❌');
    },
  });

  /* ---------------- Verify OTP ---------------- */
  const verifyOTPMutation = useMutation({
    mutationFn: (req: OTPRequest) => AuthRepository.verifyOTP(req),
    onSuccess: (res: any) => {
      toast.success(res?.message || 'OTP verified ✅');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'OTP verification failed ❌');
    },
  });

  /* ---------------- Forgot Password ---------------- */
  const forgotPasswordMutation = useMutation({
    mutationFn: (req: ForgotPasswordRequest) => AuthRepository.forgotPassword(req),
    onSuccess: (res: any) => {
      toast.success(res?.message || 'Password reset link sent ✅');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to send password reset link ❌');
    },
  });

  /* ---------------- Reset Password ---------------- */
  const resetPasswordMutation = useMutation({
    mutationFn: (req: ResetPasswordRequest) => AuthRepository.resetPassword(req),
    onSuccess: (res: any) => {
      toast.success(res?.message || 'Password reset successful ✅');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Password reset failed ❌');
    },
  });

  /* ---------------- Logout ---------------- */
  const logout = async () => {
    await AuthRepository.logout();
    clearAuth();
    toast.info('Logged out successfully 🚪');
    window.location.href = '/login';
  };

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    sendOTP: sendOTPMutation.mutateAsync,
    verifyOTP: verifyOTPMutation.mutateAsync,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    logout,
    loading:
      loginMutation.isPending ||
      registerMutation.isPending ||
      sendOTPMutation.isPending ||
      verifyOTPMutation.isPending ||
      forgotPasswordMutation.isPending ||
      resetPasswordMutation.isPending,
    error:
      loginMutation.error ||
      registerMutation.error ||
      sendOTPMutation.error ||
      verifyOTPMutation.error ||
      forgotPasswordMutation.error ||
      resetPasswordMutation.error,
    // Optional: expose mutations if needed
    mutations: {
      loginMutation,
      registerMutation,
      sendOTPMutation,
      verifyOTPMutation,
      forgotPasswordMutation,
      resetPasswordMutation,
    },
  };
};
