import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUpdatePassword } from "../hooks/usePassword";
import { validatePassword } from "../utils/passwordvalidation";
import { Eye, EyeOff } from "lucide-react";

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
            className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
          placeholder={placeholder}
        />

       <button
  type="button"
  onClick={() => togglePasswordVisibility(field)}
  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
>
  {showPassword[field] ? (
    <Eye className="w-5 h-5" />
  ) : (
    <EyeOff className="w-5 h-5" />
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
                className="w-full h-14 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(37,99,235,0.3)] transition hover:bg-blue-800 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,99,235,0.4)]"
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