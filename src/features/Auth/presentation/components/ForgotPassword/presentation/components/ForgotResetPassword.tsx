import React, { useState } from "react";

import { toast } from "react-toastify";
import {  Input, Label } from "@/components/input";
import Button from "@/components/input/Button";
import { EyeIcon, EyeOffIcon } from "@/components/icons";
import { handleApiError } from "@/components/common/ApiError";
import { useLanguage } from "@/features/context/LanguageContext";

interface Props {
  email: string;
  resetPassword: (data: {  password: string }) => Promise<void>;
  onDone: () => void;
}

export default function ForgotResetPassword({
  // email,
  resetPassword,
  onDone,
}: Props) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const{t}=useLanguage();
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword)
      return toast.error(t.forgotPassword.errors.passwordMismatch);

    if (newPassword.length < 8)
      return toast.error(t.forgotPassword.errors.passwordLength);

    try {
      await resetPassword({ password: newPassword });
      toast.success(t.forgotPassword.success.passwordReset);
      onDone();
    } catch (err: any) {
      handleApiError(err);
    }
  };

  return (
    <form onSubmit={handleReset} className="space-y-6">
      
      {/* New Password */}
      <div className="relative">
        <Label className="block text-sm font-semibold text-black mb-2">
          {t.forgotPassword.newPasswordLabel}
        </Label>

        <Input
          type={showNewPassword ? "text" : "password"}
          value={newPassword}
          onChange={(value) => setNewPassword(value)}
          className="w-full h-12 px-4 pr-10 rounded-xl border border-gray-300 bg-white text-black placeholder-gray-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
          placeholder={t.forgotPassword.descReset}
          rightElement={
             <Button
          type="button"
          onClick={() => setShowNewPassword((p) => !p)}
          className="absolute  right-1 text-gray-500 hover:text-gray-700"
        >
          {showNewPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
        </Button>
          }
          required
        />

       
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <Label className="block text-sm font-semibold text-black mb-2">
          {t.forgotPassword.confirmPasswordLabel}
        </Label>

        <Input
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(value) => setConfirmPassword(value)}
          rightElement={
            <Button
          type="button"
          onClick={() => setShowConfirmPassword((p) => !p)}
          className="absolute right-1  text-gray-500 hover:text-gray-700"
        >
          {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
        </Button>
          }
          className="w-full h-12 px-4 pr-10 rounded-xl border border-gray-300 bg-white text-black placeholder-gray-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
          placeholder={t.forgotPassword.confirmPasswordPlaceholder}
          required
        />

        
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold shadow-md transition hover:bg-blue-700 hover:-translate-y-0.5"
      >
        {t.forgotPassword.resetPassword}
      </Button>
    </form>
  );
}