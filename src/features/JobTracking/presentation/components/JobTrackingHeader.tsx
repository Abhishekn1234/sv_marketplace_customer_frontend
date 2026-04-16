"use client";

import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGenerateOtp } from "@/features/Generateotp/presentation/hooks/useGenerateOtp";
import { useGenerateOtpComplete } from "@/features/Generateotp/presentation/hooks/useGenerateOtpComplete";
import { toast } from "react-toastify";
import OtpModal from "@/components/common/CommonOtpModal";
import { useLanguage } from "@/features/context/LanguageContext";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";


interface Props {
  bookings: Booking[] | undefined;
}

export default function JobTrackingHeader({ bookings }: Props) {
  const { t } = useLanguage();
  const { bookingId } = useParams<{ bookingId: string }>();

  // ✅ LIVE STATE (socket-powered)
 const booking = useMemo(() => {
  return bookings?.find((b) => b._id === bookingId);
}, [bookings, bookingId]);

  const normalizeStatus = (status?: string) =>
    (status ?? "")
      .toString()
      .trim()
      .replace(/\s+/g, "_")
      .toUpperCase();

  const bookingStatus = normalizeStatus(booking?.status);

  const showStartButton = bookingStatus === "WORKER_ACCEPTED";

  const showCompletedOtpButton =
    bookingStatus === "WORK_COMPLETED_PENDING" ||
    bookingStatus === "WORK_COMPLETED_BY_WORKER";

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpData, setOtpData] = useState<string | number>();
  const [otpPurpose, setOtpPurpose] = useState<string>("");

  const generateOtpMutation = useGenerateOtp();
  const generateCompletedOtpMutation = useGenerateOtpComplete();

  const handleGenerateOtp = () => {
    if (!bookingId) return;

    generateOtpMutation.mutate(
      { bookingId, purpose: "WORK_START" },
      {
        onSuccess: (data) => {
          setOtpData(data?.otp ?? "");
          setOtpPurpose("Work Start OTP");
          setOtpModalOpen(true);
        },
        onError: () => toast.error("Failed to generate OTP"),
      }
    );
  };

  const handleGenerateCompletedOtp = () => {
    if (!bookingId) return;

    generateCompletedOtpMutation.mutate(
      { bookingId, purpose: "WORK_COMPLETE" },
      {
        onSuccess: (data) => {
          setOtpData(data?.otp ?? "");
          setOtpPurpose("Work Completed OTP");
          setOtpModalOpen(true);
        },
        onError: () =>
          toast.error("Failed to generate Completed Work OTP"),
      }
    );
  };

  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">

      <div className="flex-1">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
          {t.jobtrackingpage.title}
        </h1>

        <p className="text-sm sm:text-lg text-gray-500">
          {t.jobtrackingpage.subtitle}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">

        {showStartButton && (
          <button
            className="px-5 py-2 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            onClick={handleGenerateOtp}
          >
            {t.jobtrackingpage.generateWorkStartOtp}
          </button>
        )}

        {showCompletedOtpButton && (
          <button
            className="px-5 py-2 rounded-full border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
            onClick={handleGenerateCompletedOtp}
          >
            {t.jobtrackingpage.generateWorkCompletedOtp}
          </button>
        )}
      </div>

      <OtpModal
        isOpen={otpModalOpen}
        otpData={otpData}
        purpose={otpPurpose}
        onClose={() => setOtpModalOpen(false)}
      />
    </div>
  );
}