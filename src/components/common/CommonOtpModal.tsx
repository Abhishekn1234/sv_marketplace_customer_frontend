"use client";

import { useState } from "react";

import { useLanguage } from "@/features/context/LanguageContext";
import Button from "../input/Button";
import CommonModal from "./CommonModal";
import { CheckIcon, CopyIcon, ShieldCheckIcon } from "../icons";

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

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy OTP", err);
    }
  };

  return (
    <CommonModal
      open={isOpen}
      onClose={onClose}
      title={purpose}
      width="max-w-md"
    >
      <div className="flex flex-col items-center px-6 py-5 text-center">
        {/* Icon */}
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-slate-900">
          {t.common.otp.title}
        </h3>

        {/* Description */}
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          {t.common.otp.description}
        </p>

        {/* OTP Card */}
      <div className="mt-6 w-full rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
  {/* OTP Digits */}
  <div className="flex justify-center gap-2">
    {otp.split("").map((digit, index) => (
      <div
        key={index}
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl font-bold text-blue-700 shadow-sm ring-1 ring-blue-100"
      >
        {digit}
      </div>
    ))}
  </div>

  {/* Copy Button */}
  <div className="mt-5 flex justify-center">
    <Button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-2.5 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:bg-blue-100"
      aria-label={copied ? t.common.otp.copied : t.common.otp.copy}
    >
      {copied ? (
        <>
          <CheckIcon className="h-5 w-5 text-green-600" />
          <span>{t.common.otp.copied}</span>
        </>
      ) : (
        <>
          <CopyIcon className="h-5 w-5 text-slate-600" />
          <span>{t.common.otp.copy}</span>
        </>
      )}
    </Button>
  </div>
</div>

        {/* Warning */}
        <p className="mt-5 max-w-xs text-xs leading-5 text-slate-400">
          {t.common.otp.warning}
        </p>

        {/* Close Button */}
        <Button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          {t.common.close}
        </Button>
      </div>
    </CommonModal>
  );
}