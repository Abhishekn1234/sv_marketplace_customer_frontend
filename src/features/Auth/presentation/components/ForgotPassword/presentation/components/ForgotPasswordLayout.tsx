import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import ForgotPasswordInput from "./ForgotPasswordInput";
import ForgotPasswordVerify from "./ForgotPasswordVerify";
import ForgotResetPassword from "./ForgotResetPassword";
import { useAuth } from "@/features/Auth/presentation/hooks/useAuth";

import Footer from "@/components/common/CommonFooter";
import CommonNavbar from "@/components/common/CommonNavbar";

export default function ForgotPasswordLayout() {
  const navigate = useNavigate();
  const { forgotPassword, verifyOTP, resetPassword } = useAuth();

  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [hash, setHash] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ToastContainer position="top-right" />
         <CommonNavbar  rightButton={{ label: "Sign Up", to: "/register", variant: "primary" }}  />
      {/* Centered Form */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-gray-200">

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {step === "email" && "Forgot Password"}
              {step === "otp" && "Enter OTP"}
              {step === "reset" && "Reset Password"}
            </h1>
            <p className="text-gray-600">
              {step === "email" && "Enter your email to receive a reset code"}
              {step === "otp" && "Enter the OTP sent to your email"}
              {step === "reset" && "Enter your new password"}
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
  <button
    onClick={() => navigate("/login")}
    className="flex items-center gap-1 text-blue-600 font-bold hover:underline"
  >
    <ArrowLeft size={16} />
    Back to Login
  </button>
</div>
        </div>
      </div>

   
      <Footer />
    </div>
  );
}