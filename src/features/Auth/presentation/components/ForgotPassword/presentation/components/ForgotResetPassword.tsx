import React, { useState } from "react";

import { toast } from "react-toastify";
import {  Input, Label } from "@/components/input";
import Button from "@/components/input/Button";
import { EyeIcon, EyeOffIcon } from "@/components/icons";
import { handleApiError } from "@/components/common/ApiError";

interface Props {
  email: string;
  resetPassword: (data: { email: string; password: string }) => Promise<void>;
  onDone: () => void;
}

export default function ForgotResetPassword({
  email,
  resetPassword,
  onDone,
}: Props) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    if (newPassword.length < 8)
      return toast.error("Password must be at least 8 characters");

    try {
      await resetPassword({ email, password: newPassword });
      toast.success("Password reset successful!");
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
          New Password
        </Label>

        <Input
          type={showNewPassword ? "text" : "password"}
          value={newPassword}
          onChange={(value) => setNewPassword(value)}
          className="w-full h-12 px-4 pr-10 rounded-xl border border-gray-300 bg-white text-black placeholder-gray-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
          placeholder="Enter new password"
          required
        />

        <Button
          type="button"
          onClick={() => setShowNewPassword((p) => !p)}
          className="absolute right-3 top-[42px] text-gray-500 hover:text-gray-700"
        >
          {showNewPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
        </Button>
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <Label className="block text-sm font-semibold text-black mb-2">
          Confirm Password
        </Label>

        <Input
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(value) => setConfirmPassword(value)}
          className="w-full h-12 px-4 pr-10 rounded-xl border border-gray-300 bg-white text-black placeholder-gray-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
          placeholder="Confirm new password"
          required
        />

        <Button
          type="button"
          onClick={() => setShowConfirmPassword((p) => !p)}
          className="absolute right-3 top-[42px] text-gray-500 hover:text-gray-700"
        >
          {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
        </Button>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold shadow-md transition hover:bg-blue-700 hover:-translate-y-0.5"
      >
        Reset Password
      </Button>
    </form>
  );
}