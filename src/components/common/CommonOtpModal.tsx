"use client";

import Button from "../input/Button";



interface OtpModalProps {
  isOpen: boolean;
  otpData?: string | number;
  purpose?: string;
  onClose: () => void;
}

export default function OtpModal({ isOpen, otpData, purpose, onClose }: OtpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">{purpose}</h2>
        <p className="text-xl sm:text-2xl font-mono text-center mb-6 tracking-widest">
          {otpData ?? "No OTP returned"}
        </p>
        <Button
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
}