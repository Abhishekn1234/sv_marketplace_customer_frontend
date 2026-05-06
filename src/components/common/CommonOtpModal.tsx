"use client";

import { useLanguage } from "@/features/context/LanguageContext";
import Button from "../input/Button";
import CommonModal from "./CommonModal";

interface OtpModalProps {
  isOpen: boolean;
  otpData?: string | number;
  purpose?: string;
  onClose: () => void;
}

export default function OtpModal({
  isOpen,
  otpData,
  purpose,
  onClose,
}: OtpModalProps) {
  const {t}=useLanguage();
  return (
    <CommonModal
      open={isOpen}
      onClose={onClose}
      title={purpose}
      width="max-w-sm"
      footer={
        <Button
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={onClose}
        > 
         {t.common.close}
        </Button>
      }
    >
      <p className="text-xl sm:text-2xl font-mono text-center tracking-widest">
        {otpData ?? "No OTP returned"}
      </p>
    </CommonModal>
  );
}