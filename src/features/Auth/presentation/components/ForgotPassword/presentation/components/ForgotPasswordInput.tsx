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
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return toast.error("Please enter your email");

    try {
      const res = await forgotPassword({ email });
      toast.success("OTP sent to your email!");
      onNext(res.hash);
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP");
    }
  };

  return (
    <form onSubmit={handleSendOTP} className="space-y-6">
      
      <div>
        <label className="block text-sm font-semibold text-black mb-2">
          Email Address
        </label>

        <input
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-black placeholder-gray-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
        />
      </div>

      <button
        type="submit"
        className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold shadow-md transition hover:bg-blue-700 hover:-translate-y-0.5"
      >
        Send OTP
      </button>
    </form>
  );
}