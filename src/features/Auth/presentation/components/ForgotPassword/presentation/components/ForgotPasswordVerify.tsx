import React, { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  hash: string;
  onNext: () => void;
  verifyOTP: (data: { hash: string; otp: string }) => Promise<void>;
}

export default function ForgotPasswordVerify({
  hash,
  onNext,
  verifyOTP,
}: Props) {
  const [otp, setOtp] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6)
      return toast.error("Enter a valid 6-digit OTP");

    try {
      await verifyOTP({ hash, otp });
      toast.success("OTP verified!");
      onNext();
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP");
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-6">
      
      <div>
        <label className="block text-sm font-semibold text-black mb-2">
          Enter OTP
        </label>

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "")) // allow only numbers
          }
          maxLength={6}
          required
          className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-black placeholder-gray-400 tracking-widest text-center text-lg focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
        />
      </div>

      <button
        type="submit"
        className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold shadow-md transition hover:bg-blue-700 hover:-translate-y-0.5"
      >
        Verify OTP
      </button>
    </form>
  );
}