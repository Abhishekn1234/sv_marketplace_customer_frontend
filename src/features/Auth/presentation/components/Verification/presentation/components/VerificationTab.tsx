import { useLanguage } from "@/features/context/LanguageContext";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/features/core/store/auth";
import OTPSection from "./OTPInputGroup";
import EditPhoneNumber from "./EditPhoneNumber";
import { useVerifyOtpMobile } from "../hooks/useVerifyOtpMobile";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useVerificationStore } from "@/features/core/store/usestep";
import { useSendOtpMobile } from "../hooks/useSendOtpMobile";
import Button from "@/components/input/Button";

export default function VerificationTab() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(120);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const { mobileForVerification } = useAuthStore();
  const [mobileNumber, setMobileNumber] = useState<string>(mobileForVerification || "");

  const { verifyOtp, loading } = useVerifyOtpMobile();
  const { sendOtpMobile} = useSendOtpMobile();
  const { setStep } = useVerificationStore();

  const [currentStep, setCurrentStep] = useState<1 | 2>(2);

  // update phone
  useEffect(() => {
    setMobileNumber(mobileForVerification || "");
  }, [mobileForVerification]);

  // OTP change
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // backspace navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // paste otp
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const digits = e.clipboardData.getData("text").match(/\d/g);
    if (!digits) return;

    const updated = [...otp];

    digits.slice(0, 6).forEach((d, i) => {
      updated[i] = d;
    });

    setOtp(updated);
    inputsRef.current[Math.min(digits.length, 5)]?.focus();
  };

  const allFilled = otp.every((d) => d.length === 1);

  // timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // format timer
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

const resend = async () => {
  if (!mobileNumber) {
    toast.error("Mobile number missing");
    return;
  }

  setOtp(Array(6).fill(""));
  setTimeLeft(120);
  inputsRef.current[0]?.focus();

  try {
    const response: any = await sendOtpMobile({ phone: mobileNumber }); // ⚠ any here
    if (response?.otp) {
      toast.success(`OTP sent! Your OTP is: ${response.otp}`, { autoClose: 10000 });
    } else {
      toast.success("OTP sent again");
    }
  } catch (err: any) {
    toast.error(err.message || "Failed to resend OTP");
  }
};
  // // change phone
  // const handleChangeNumber = () => {
  //   setCurrentStep(1);
  //   setStep(1);
  // };

  // submit otp
  const handleSubmitOtp = async () => {
    if (timeLeft === 0) {
      toast.error("OTP expired. Please resend OTP.");
      return;
    }

    if (!mobileForVerification) {
      toast.error("Mobile number missing");
      return;
    }

    const otpCode = otp.join("");

    try {
      const response = await verifyOtp({
        hash: mobileForVerification,
        otp: otpCode,
      });

      toast.success(response.message);
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "OTP verification failed");
    }
  };

  // next from edit phone
  const handleNextFromPhoneEdit = () => {
    setCurrentStep(2);
    setStep(2);

    setOtp(Array(6).fill(""));
    setTimeLeft(120);

    inputsRef.current[0]?.focus();
  };

  const isExpired = timeLeft === 0;

  return (
    <div className="min-h-screen font-inter text-[#1a1a2e] bg-gray-50">
      <main className="flex justify-center items-center px-4 sm:px-6 py-10 sm:py-12 min-h-screen">
        <div className="relative w-full max-w-[520px] bg-white border border-gray-200 rounded-2xl md:rounded-[32px] p-6 sm:p-8 md:p-12 shadow-xl overflow-hidden">

          <div className="absolute top-0 inset-x-0 h-1 bg-amber-500" />

          {currentStep === 1 ? (
            <EditPhoneNumber onNext={handleNextFromPhoneEdit} />
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  {t.verification.title}
                </h1>

                <p className="text-gray-500 font-medium">
                  {t.verification.subtitle}
                </p>

                <div className="inline-flex items-center gap-2 mt-3 px-3 py-2 sm:px-4 bg-gray-50 rounded-xl text-sm sm:text-base font-semibold">
                  {mobileNumber || "+1 (555) 123-4567"}
                </div>
              </div>

              {/* OTP Inputs */}
              <OTPSection
                otp={otp}
                timeLeft={timeLeft}
                inputsRef={inputsRef}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
                handlePaste={handlePaste}
                resend={resend}
                disabled={isExpired}
              />

              {/* Timer */}
              <div className="text-center text-sm text-gray-500 mt-4 mb-6">
                {isExpired ? (
                  <span className="text-red-500 font-semibold">
                    OTP Expired
                  </span>
                ) : (
                  <>Expires in {formatTime(timeLeft)}</>
                )}
              </div>

              {/* Verify Button */}
              <Button
                disabled={!allFilled || loading || isExpired}
                onClick={handleSubmitOtp}
                className="w-full h-12 sm:h-14 cursor-pointer rounded-full bg-blue-600 text-white text-sm sm:text-base font-semibold disabled:bg-gray-300 hover:bg-blue-700 transition"
              >
                {loading ? "Verifying..." : t.verification.verify_continue}
              </Button>

              {/* Change number */}
              {/* <div className="mt-6 pt-6 border-t text-center">
                <button
                  onClick={handleChangeNumber}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-900"
                >
                  {t.verification.change_number}
                </button>
              </div> */}

             
             
            </>
          )}
        </div>
      </main>
    </div>
  );
}