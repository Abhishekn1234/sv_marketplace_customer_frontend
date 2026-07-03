import { handleApiError } from "@/components/common/ApiError";
import { Input, Label } from "@/components/input";
import Button from "@/components/input/Button";
import { useLanguage } from "@/features/context/LanguageContext";
import React from "react";
import { toast } from "react-toastify";

interface Props {
  email: string;
 
  setEmail: (val: string) => void;
  onNext: (hash: string) => void;
  forgotPassword: (data: { email: string }) => Promise<{ hash: string }>;
}

export default function ForgotPasswordInput({
  email,
  setEmail,

  onNext,
  forgotPassword,
}: Props) {
  const {t}=useLanguage();
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ FIXED HERE
    if (!email)
      return toast.error(t.forgotPassword.errors.enterEmail);

    try {
      const res = await forgotPassword({ email });

      toast.success(t.forgotPassword.success.otpSent);

      onNext(res.hash);
    } catch (err: any) {
      handleApiError(err);
    }
  };

  return (
    <form onSubmit={handleSendOTP} className="space-y-6">

      <div>
        <Label className="block text-sm font-semibold text-black mb-2">
          {t.forgotPassword.emailLabel}
        </Label>

        <Input
          type="email"
          placeholder={t.forgotPassword.emailPlaceholder}
          value={email}
          onChange={(value) => setEmail(value)}
          required
          className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-black placeholder-gray-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
        />
      </div>

      <Button
        type="submit"
        className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold shadow-md transition hover:bg-blue-700 hover:-translate-y-0.5"
      >
        {t.forgotPassword.sendOtp}
      </Button>
    </form>
  );
}