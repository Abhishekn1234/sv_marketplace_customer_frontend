import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import ForgotPasswordInput from "./ForgotPasswordInput";
import ForgotPasswordVerify from "./ForgotPasswordVerify";
import ForgotResetPassword from "./ForgotResetPassword";
import { useAuth } from "@/features/Auth/presentation/hooks/useAuth";
import { ArrowLeftIcon } from "@/components/icons";
import Button from "@/components/input/Button";
import { useLanguage } from "@/features/context/LanguageContext";



export default function ForgotPasswordLayout() {
  const navigate = useNavigate();
  const { forgotPassword, verifyOTP, resetPassword } = useAuth();
  const{t}=useLanguage();
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [hash, setHash] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ToastContainer position="top-right" />
         
      {/* Centered Form */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-gray-200">

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {step === "email" && t.forgotPassword.titleEmail}
              {step === "otp" && t.forgotPassword.titleOtp}
              {step === "reset" && t.forgotPassword.titleReset}
            </h1>
            <p className="text-gray-600">
              {step === "email" && t.forgotPassword.descEmail}
              {step === "otp" && t.forgotPassword.descOtp}
              {step === "reset" && t.forgotPassword.descReset}
            </p>
          </div>

          {step === "email" && (
            <ForgotPasswordInput
               
              email={email}
              setEmail={setEmail}
              forgotPassword={forgotPassword}
              onNext={(hash) => {
                setHash(hash);
                setStep("otp");
              }}
            />
          )}

          {step === "otp" && (
            <ForgotPasswordVerify
              hash={hash}
              verifyOTP={verifyOTP}
              onNext={() => setStep("reset")}
              onResend={() => {
              setStep("email"); 
            }}
            />
          )}

          {step === "reset" && (
            <ForgotResetPassword
              email={email}
              resetPassword={resetPassword}
              onDone={() => navigate("/login")}
            />
          )}

        <div className="mt-6 flex justify-center">
  <Button
    onClick={() => navigate("/login")}
    className="flex items-center gap-1 text-blue-600 font-bold hover:underline"
  >
    <ArrowLeftIcon size={16} />
    {t.forgotPassword.backToLogin}
  </Button>
</div>
        </div>
      </div>

  
    </div>
  );
}