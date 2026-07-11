"use client";

import { useState } from "react";

import { useLanguage } from "@/features/context/LanguageContext";
import Button from "../input/Button";
import CommonModal from "./CommonModal";
import { ShieldCheckIcon, CopyIcon, CheckIcon } from "../icons";

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
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!otpData) return;

    try {
      await navigator.clipboard.writeText(otp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy OTP", err);
    }
  };

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
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2" dir="ltr">
            {otp.split("").map((digit, index) => (
              <div
                key={index}
                className="flex h-10 w-8 items-center justify-center rounded-lg bg-white text-lg font-bold text-blue-700 shadow-sm ring-1 ring-blue-100 sm:h-11 sm:w-10 sm:rounded-xl sm:text-xl"
              >
                {digit}
              </div>
            ))}
          </div>

          {/* Copy Button */}
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:bg-blue-100"
              aria-label={copied ? t.common.otp.copied : t.common.otp.copy}
            >
              {copied ? (
                <>
                  <CheckIcon className="h-4 w-4 text-green-600" />
                  <span>{t.common.otp.copied}</span>
                </>
              ) : (
                <>
                  <CopyIcon className="h-4 w-4 text-slate-600" />
                  <span>{t.common.otp.copy}</span>
                </>
              )}
            </button>
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