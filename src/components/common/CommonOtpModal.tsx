"use client";

import { useLanguage } from "@/features/context/LanguageContext";
import Button from "../input/Button";
import CommonModal from "./CommonModal";
import { ShieldCheckIcon } from "../icons";

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
  const { t } = useLanguage();

  const otp = String(otpData ?? "------");

  return (
    <CommonModal
      open={isOpen}
      onClose={onClose}
      title={purpose}
      width="max-w-sm"
    >
      <div className="flex flex-col items-center px-4 py-4 text-center sm:px-6 sm:py-5">
        {/* Icon */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 sm:h-14 sm:w-14">
          <ShieldCheckIcon className="h-6 w-6 text-blue-600 sm:h-7 sm:w-7" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
          {t.common.otp.title}
        </h3>

        {/* Description */}
        <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
          {t.common.otp.description}
        </p>

        {/* OTP Card */}
        <div className="mt-5 w-full rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {otp.split("").map((digit, index) => (
              <div
                key={index}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-base font-bold text-blue-700 shadow-sm ring-1 ring-blue-100 sm:h-11 sm:w-11 sm:rounded-xl sm:text-xl"
              >
                {digit}
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        <p className="mt-4 max-w-xs text-xs leading-5 text-slate-400">
          {t.common.otp.warning}
        </p>

        {/* Close Button */}
        <Button
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {t.common.close}
        </Button>
      </div>
    </CommonModal>
  );
}