import { handleApiError } from "@/components/common/ApiError";
import { Input, Label } from "@/components/input";
import Button from "@/components/input/Button";
import { useLanguage } from "@/features/context/LanguageContext";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  hash: string;
  onNext: () => void;
  verifyOTP: (data: { hash: string; otp: string }) => Promise<void>;

  // 👇 ADD THIS (important)
  onResend: () => void;
}

export default function ForgotPasswordVerify({
  hash,
  onNext,
  verifyOTP,
  onResend,
}: Props) {
  const [otp, setOtp] = useState("");
  const { t } = useLanguage();

  // ⏱ timer state
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // start countdown
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6)
      return toast.error(t.forgotPassword.errors.otpInvalid);

    try {
      await verifyOTP({ hash, otp });
      toast.success(t.forgotPassword.success.otpVerified);
      onNext();
    } catch (err: any) {
      handleApiError(err);
    }
  };

  const handleResend = () => {
    // reset timer
    setTimer(30);
    setCanResend(false);
    setOtp("");

    // go back or trigger resend flow
    onResend();
  };

  return (
    <form onSubmit={handleVerify} className="space-y-6">

      <div>
        <Label className="block text-sm font-semibold text-black mb-2">
          {t.forgotPassword.otpLabel}
        </Label>

        <Input
          type="text"
          inputMode="numeric"
          placeholder={t.forgotPassword.otpPlaceholder}
          value={otp}
          onChange={(value) => setOtp(value.replace(/\D/g, ""))}
          maxLength={6}
          className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-black text-center tracking-widest"
        />
      </div>

      {/* ⏱ TIMER UI */}
      {!canResend ? (
        <p className="text-sm text-gray-500 text-center">
          Resend OTP in <span className="font-semibold">{timer}s</span>
        </p>
      ) : (
        <button
          type="button"
          onClick={handleResend}
          className="text-blue-600 font-semibold text-sm hover:underline w-full"
        >
          Resend OTP
        </button>
      )}

      <Button
        type="submit"
        className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold"
      >
        {t.forgotPassword.verifyOtp}
      </Button>
    </form>
  );
}