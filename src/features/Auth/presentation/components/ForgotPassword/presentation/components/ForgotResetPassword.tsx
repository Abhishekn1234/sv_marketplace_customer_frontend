import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

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
      toast.error(err.message || "Failed to reset password");
    }
  };

  return (
    <form onSubmit={handleReset} className="space-y-6">
      
      {/* New Password */}
      <div className="relative">
        <label className="block text-sm font-semibold text-black mb-2">
          New Password
        </label>

        <input
          type={showNewPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full h-12 px-4 pr-10 rounded-xl border border-gray-300 bg-white text-black placeholder-gray-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
          placeholder="Enter new password"
          required
        />

        <button
          type="button"
          onClick={() => setShowNewPassword((p) => !p)}
          className="absolute right-3 top-[42px] text-gray-500 hover:text-gray-700"
        >
          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <label className="block text-sm font-semibold text-black mb-2">
          Confirm Password
        </label>

        <input
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full h-12 px-4 pr-10 rounded-xl border border-gray-300 bg-white text-black placeholder-gray-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
          placeholder="Confirm new password"
          required
        />

        <button
          type="button"
          onClick={() => setShowConfirmPassword((p) => !p)}
          className="absolute right-3 top-[42px] text-gray-500 hover:text-gray-700"
        >
          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold shadow-md transition hover:bg-blue-700 hover:-translate-y-0.5"
      >
        Reset Password
      </button>
    </form>
  );
}