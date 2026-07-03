import { useAuthStore } from '../../../core/store/auth';
import { useMutation } from '@tanstack/react-query';
import AuthRepository from '../../data/repositories/AuthRepository';
import { toast } from 'react-toastify';
import type {OTPRequest} from '../../domain/entities/otprequest.types';
import type { ResetPasswordRequest } from '../../domain/entities/resetpasswordrequest.types';
import type { ForgotPasswordRequest } from '../../domain/entities/forgotpasswordrequest';
import type { SendOTPRequest } from '../../domain/entities/sendotprequest.types';
import type { LoginRequest } from '../../domain/entities/loginrequest.types';
import type { RegisterRequest } from '../../domain/entities/registerrequest';
import { handleApiError } from '@/components/common/ApiError';
import { handleSuccess } from '@/components/common/ApiSuccess';
export const useAuth = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  
  const loginMutation = useMutation({
    mutationFn: async (req: LoginRequest) => {
      const res = await AuthRepository.login(req);

      
      setTokens(res.accessToken, res.refreshToken);
      setUser(res.user);

      return res;
    },
    onSuccess: (_res) => {
      // toast.success(res.message);
    },
    onError: (err: any) => {
      handleApiError(err);
    },
  });

 
  const registerMutation = useMutation({
    mutationFn: (req: RegisterRequest) => AuthRepository.register(req),
    onSuccess: (res: any) => {
     handleSuccess(res);
    },
    onError: (err: any) => {
      handleApiError(err);
    },
  });

 
  const sendOTPMutation = useMutation({
    mutationFn: (req: SendOTPRequest) => AuthRepository.sendOTP(req),
    onSuccess: (res: any) => {
      toast.success(res?.message || 'OTP sent successfully ✅');
    },
    onError: (err: any) => {
    handleApiError(err);
    },
  });

  
  const verifyOTPMutation = useMutation({
    mutationFn: (req: OTPRequest) => AuthRepository.verifyOTP(req),
    onSuccess: (res: any) => {
      toast.success(res?.message || 'OTP verified ✅');
    },
    onError: (err: any) => {
      handleApiError(err);
    },
  });

 
  const forgotPasswordMutation = useMutation({
    mutationFn: (req: ForgotPasswordRequest) => AuthRepository.forgotPassword(req),
    onSuccess: (res: any) => {
     handleSuccess(res);
    },
    onError: (err: any) => {
     handleApiError(err);
    },
  });

 
  const resetPasswordMutation = useMutation({
    mutationFn: (req: ResetPasswordRequest) => AuthRepository.resetPassword(req),
    onSuccess: (res: any) => {
      toast.success(res?.message || 'Password reset successful ✅');
    },
    onError: (err: any) => {
     handleApiError(err);
    },
  });

 
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
