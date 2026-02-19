import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { forgotPassword, verifyOTP, resetPassword } = useAuth();

  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [emailInput, setEmailInput] = useState('');
  const [hash, setHash] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return toast.error('Please enter your email');
    try {
      const response = await forgotPassword({ email: emailInput });
      setHash(response.hash);
      toast.success('OTP sent to your email!');
      setStep('otp');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error('Enter a valid 6-digit OTP');
    try {
      await verifyOTP({ hash, otp });
      toast.success('OTP verified!');
      setStep('reset');
    } catch (err: any) {
      toast.error(err.message || 'Invalid OTP');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    if (newPassword.length < 8) return toast.error('Password must be at least 8 characters');
    try {
      await resetPassword({ email: emailInput, password: newPassword });
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <ToastContainer position="top-right" />
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {step === 'email' && 'Forgot Password'}
            {step === 'otp' && 'Enter OTP'}
            {step === 'reset' && 'Reset Password'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {step === 'email' && 'Enter your email to receive a reset code'}
            {step === 'otp' && 'Enter the OTP sent to your email'}
            {step === 'reset' && 'Enter your new password'}
          </p>
        </div>

        {step === 'email' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="john@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Send OTP
            </Button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <Label>OTP</Label>
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
            <Button type="submit" className="w-full">
              Verify OTP
            </Button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="relative">
              <Label>New Password</Label>
              <Input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="relative">
              <Label>Confirm Password</Label>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button type="submit" className="w-full">
              Reset Password
            </Button>
          </form>
        )}

        <div className="text-center mt-6">
          <Button
            variant="link"
            onClick={() => navigate('/login')}
            className="inline-flex items-center text-sm"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Login
          </Button>
        </div>

      </div>
    </div>
  );
}

