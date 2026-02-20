import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUpdatePassword } from "../hooks/usePassword";
import { validatePassword } from "../utils/passwordvalidation";

export default function ChangePasswordCard() {
  const navigate = useNavigate();
  const { updatePassword, loading } = useUpdatePassword();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validatePassword(
      oldPassword,
      newPassword,
      confirmPassword
    );

    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    try {
      await updatePassword(oldPassword, newPassword);
      toast.success("Password updated successfully 🎉");
      navigate(-1);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  const togglePasswordVisibility = (
    field: "old" | "new" | "confirm"
  ) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const renderPasswordInput = (
    label: string,
    value: string,
    onChange: (val: string) => void,
    field: "old" | "new" | "confirm",
    placeholder: string
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="relative">
        <input
          type={showPassword[field] ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder={placeholder}
        />

        <button
          type="button"
          onClick={() => togglePasswordVisibility(field)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
        >
          {showPassword[field] ? (
            // Eye Open
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5
                c4.478 0 8.268 2.943 9.542 7
                -1.274 4.057-5.064 7-9.542 7
                -4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          ) : (
            // Eye Closed
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3l18 18"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600 hover:text-blue-600 transition"
          >
            ← Back to Settings
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <h2 className="text-2xl font-bold text-white">
              Change Password
            </h2>
            <p className="text-blue-100 mt-2 text-sm">
              Secure your account with a strong password
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderPasswordInput(
                "Current Password",
                oldPassword,
                setOldPassword,
                "old",
                "Enter current password"
              )}

              {renderPasswordInput(
                "New Password",
                newPassword,
                setNewPassword,
                "new",
                "Enter new password"
              )}

              {renderPasswordInput(
                "Confirm New Password",
                confirmPassword,
                setConfirmPassword,
                "confirm",
                "Confirm new password"
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}