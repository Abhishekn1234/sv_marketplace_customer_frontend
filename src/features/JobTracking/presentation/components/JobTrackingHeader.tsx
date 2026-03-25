"use client";

import { useState } from "react";
import { useParams } from "react-router-dom";
import { useBookingHistory } from "@/features/Bookings/presentation/hooks/useBookingHistory";
import { useGenerateOtp } from "@/features/Generateotp/presentation/hooks/useGenerateOtp";
import { useGenerateOtpComplete } from "@/features/Generateotp/presentation/hooks/useGenerateOtpComplete";
import { toast } from "react-toastify";
import OtpModal from "@/components/common/CommonOtpModal";

export default function JobTrackingHeader() {
  const { bookingId } = useParams<{ bookingId: string }>();
const { data: bookings } = useBookingHistory();

// ✅ flatten all pages into one array
const allBookings =
  bookings?.pages.flatMap((page) => page.data) || [];

// ✅ find booking
const booking = allBookings.find(
  (item) => item._id === bookingId
);
  const bookingStatus = booking?.status?.trim().toUpperCase() || "";

  // OTP button visibility
  const showOtpButton = bookingStatus === "WORKER_ACCEPTED";
 const showCompletedOtpButton = bookingStatus.includes("WORK_COMPLETED_PENDING");

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpData, setOtpData] = useState<string | number>();
  const [otpPurpose, setOtpPurpose] = useState<string>("");

  const generateOtpMutation = useGenerateOtp();
  const generateCompletedOtpMutation = useGenerateOtpComplete();

  // Generate Work Start OTP
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
        onError: (error) => {
          console.error(error);
          toast.error("Failed to generate OTP");
        },
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
        onError: (error) => {
          console.error(error);
          toast.error("Failed to generate Completed Work OTP");
        },
      }
    );
  };

  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
      {/* Header Section */}
      <div className="flex-1">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-2">
          Job Tracking
        </h1>
        <p className="text-sm sm:text-lg font-medium text-gray-500">
          Track your service request in real-time
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
  {showOtpButton && (
    <button
      className="w-full sm:w-auto px-5 py-2 rounded-full border-2 font-semibold transition-all duration-300 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
      onClick={handleGenerateOtp}
    >
      Generate Work Start OTP
    </button>
  )}

  {showCompletedOtpButton && (
    <button
      className="w-full sm:w-auto px-5 py-2 rounded-full border-2 border-green-600 text-green-600 font-semibold transition-all duration-300 hover:bg-green-600 hover:text-white"
      onClick={handleGenerateCompletedOtp}
    >
      Generate Work Completed OTP
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