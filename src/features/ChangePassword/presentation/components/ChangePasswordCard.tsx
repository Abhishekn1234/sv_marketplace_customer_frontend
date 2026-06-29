import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUpdatePassword } from "../hooks/usePassword";
import { validatePassword } from "../utils/passwordvalidation";

import { useLanguage } from "@/features/context/LanguageContext";
import Button from "@/components/input/Button";
import { Input, Label } from "@/components/input";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import CommonCard from "@/components/common/CommonCards";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon } from "@/components/icons";

export default function ChangePasswordCard() {
  const navigate = useNavigate();
  const { updatePassword, loading } = useUpdatePassword();
  const {t,isRTLOrder}=useLanguage();
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
      toast.error(err?.response?.data?.message || "Something went wrong");
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
    <Label
      className={`block text-sm font-medium text-gray-700 mb-2 ${
        isRTLOrder ? "text-right" : "text-left"
      }`}
    >
      {label}
    </Label>

    <div className="relative">
      <Input
        type={showPassword[field] ? "text" : "password"}
        value={value}
        onChange={(value) => onChange(value)}
        required
        placeholder={placeholder}
        dir={isRTLOrder ? "rtl" : "ltr"}
        className={`
          w-full h-12 rounded-xl border-2 border-gray-200 bg-gray-50
          focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100
          outline-none transition
          ${isRTLOrder ? "pr-4 pl-12 text-right" : "pl-4 pr-12 text-left"}
        `}
      />

      <Button
        type="button"
        onClick={() => togglePasswordVisibility(field)}
        className={`
          absolute inset-y-0
          ${isRTLOrder ? "left-3" : "right-3"}
          flex items-center
          text-gray-500 hover:text-gray-700
        `}
      >
        {showPassword[field] ? (
          <EyeIcon className="w-5 h-5" />
        ) : (
          <EyeOffIcon className="w-5 h-5" />
        )}
      </Button>
    </div>
  </div>
);
 return (
  <div
    dir={isRTLOrder ? "rtl" : "ltr"}
    className="min-h-screen flex items-center justify-center px-4 py-8"
  >
    <div className="w-full max-w-md">
      {/* Back Button */}
      <div
      className={`mb-4 ${
      isRTLOrder ? "text-right" : "text-left"
      }`}
      >
              <div
                  onClick={() => navigate(-1)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      navigate(-1);
                    }
                  }}
                  className={`inline-flex cursor-pointer items-center gap-2 flex-nowrap text-sm text-gray-600 hover:text-blue-600 transition ${
                    isRTLOrder ? "flex-row-reverse" : ""
                  }`}
                >
                  <ArrowLeftIcon
                    className={`h-4 w-4 shrink-0 ${isRTLOrder ? "rotate-180" : ""}`}
                  />
                  <span className="whitespace-nowrap">
                    {t.changepasswordpage.backToSettings}
                  </span>
                </div>
      </div>

      <CommonCard className="overflow-hidden border border-gray-200 shadow-xl rounded-3xl">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 px-8 py-10">
          <div className="absolute inset-0 bg-black/5" />

          <div
            className={`relative ${
              isRTLOrder ? "text-right" : "text-left"
            }`}
          >
            <h2 className="text-3xl font-bold text-white">
              {t.changepasswordpage.cardTitle}
            </h2>

            <p className="text-blue-100 mt-2 max-w-md">
              {t.changepasswordpage.cardSubtitle}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 bg-white">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-5">
              {renderPasswordInput(
                t.changepasswordpage.currentPassword,
                oldPassword,
                setOldPassword,
                "old",
                t.changepasswordpage.enterCurrentPassword
              )}

              {renderPasswordInput(
                t.changepasswordpage.newPassword,
                newPassword,
                setNewPassword,
                "new",
                t.changepasswordpage.enterNewPassword
              )}

              {renderPasswordInput(
                t.changepasswordpage.confirmNewPassword,
                confirmPassword,
                setConfirmPassword,
                "confirm",
                t.changepasswordpage.confirmNewPassword
              )}
            </div>

            <div className="border-t border-gray-100 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  h-14
                  rounded-2xl
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  font-semibold
                  transition-all
                  duration-200
                  shadow-lg
                  hover:shadow-xl
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                {loading ? (
                  <>
                    <CommonSpinner
                      size={16}
                      color="white"
                    />
                    {t.changepasswordpage.updating}
                  </>
                ) : (
                  <>
                    🔒{" "}
                    {t.changepasswordpage.updatePassword}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </CommonCard>
    </div>
  </div>
);
}