"use client";

import { useState } from "react";
import { useParams } from "react-router-dom";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { useGenerateOtp } from "@/features/Generateotp/presentation/hooks/useGenerateOtp";
import { useGenerateOtpComplete } from "@/features/Generateotp/presentation/hooks/useGenerateOtpComplete";
import { toast } from "react-toastify";

export default function JobTrackingHeader() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { bookings } = useBookings();
  console.log(bookings);
  const booking = bookings?.find((item) => item._id === bookingId);
  // console.log(booking);
  // // Normalize status to avoid casing/space issues
  const bookingStatus = booking?.status?.trim().toUpperCase();
  //  console.log(bookingStatus);
  const showOtpButton = bookingStatus === "WORKER_ACCEPTED";
  const showCompletedOtpButton = bookingStatus === "WORK_COMPLETED_PENDING";
  console.log(showCompletedOtpButton);
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
      { bookingId, purpose: "WORK_COMPLETED" },
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
    <div className="mb-8 flex items-start justify-between">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-2">
          Job Tracking
        </h1>
        <p className="text-base sm:text-lg font-medium text-gray-500">
          Track your service request in real-time
        </p>
      </div>

      {/* OTP Buttons */}
      <div className="flex gap-4">
        {showOtpButton && (
          <button
            className="px-6 py-2 cursor-pointer rounded-full border-2 border-blue-600 text-blue-600 font-semibold transition-all duration-300 hover:bg-blue-600 hover:text-white"
            onClick={handleGenerateOtp}
          >
            Generate Work Start OTP
          </button>
        )}
        {showCompletedOtpButton && (
          <button
            className="px-6 py-2 cursor-pointer rounded-full border-2 border-green-600 text-green-600 font-semibold transition-all duration-300 hover:bg-green-600 hover:text-white"
            onClick={handleGenerateCompletedOtp}
          >
            Generate Work Completed OTP
          </button>
        )}
      </div>

      {/* OTP Modal */}
      {otpModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">{otpPurpose}</h2>
            <p className="text-lg font-mono text-center mb-4">
              {otpData ?? "No OTP returned"}
            </p>
            <button
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setOtpModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}