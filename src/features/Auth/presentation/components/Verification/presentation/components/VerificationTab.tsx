import { useLanguage } from "@/features/context/LanguageContext";
import { useEffect, useRef, useState } from "react";
import VerificationStepper from "./VerificationStepper";
import OTPSection from "./OTPInputGroup";

export default function VerificationTab() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(120);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const { t } = useLanguage();

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").match(/\d/g);
    if (!digits) return;

    const updated = [...otp];
    digits.slice(0, 6).forEach((d, i) => (updated[i] = d));
    setOtp(updated);

    inputsRef.current[Math.min(digits.length, 5)]?.focus();
  };

  const allFilled = otp.every((d) => d.length === 1);

  /* TIMER */
  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const resend = () => {
    setOtp(Array(6).fill(""));
    setTimeLeft(120);
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-inter text-[#1a1a2e]">

      <VerificationStepper />

      <main className="flex justify-center items-center px-6 py-12">
        <div className="relative w-full max-w-[520px] bg-white border border-gray-200 rounded-[32px] p-12 shadow-xl overflow-hidden">

          <div className="absolute top-0 inset-x-0 h-1 bg-amber-500" />

          {/* BADGE */}
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full shadow-sm mb-6">
            <span className="w-2 h-2 bg-amber-500 rounded-full" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              {t.verification.badge}
            </span>
          </div>

          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {t.verification.title}
            </h1>
            <p className="text-gray-500 font-medium">
              {t.verification.subtitle}
            </p>
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-gray-50 rounded-xl font-semibold">
              +1 (555) 123-4567
            </div>
          </div>

          <OTPSection
            otp={otp}
            timeLeft={timeLeft}
            inputsRef={inputsRef}
            handleChange={handleChange}
            handleKeyDown={handleKeyDown}
            handlePaste={handlePaste}
            resend={resend}
          />

          {/* SUBMIT */}
          <button
            disabled={!allFilled}
            className="w-full h-14 rounded-full bg-blue-600 text-white font-semibold
                       disabled:bg-gray-300 hover:bg-blue-700 transition"
          >
            {t.verification.verify_continue}
          </button>

          {/* CHANGE NUMBER */}
          <div className="mt-6 pt-6 border-t text-center">
            <button className="text-sm font-semibold text-gray-500 hover:text-gray-900">
              {t.verification.change_number}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
