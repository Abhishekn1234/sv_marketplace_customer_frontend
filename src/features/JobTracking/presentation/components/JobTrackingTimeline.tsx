"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect, useRef } from "react";
import { initializeSocket } from "@/features/core/Websocket/socket";
import { useVerifyPayment } from "@/features/Payment/presentation/hooks/useVerifyPayment";
import { useLanguage } from "@/features/context/LanguageContext";
import { useAuthStore } from "@/features/core/store/auth";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";
import { useGenerateOtpComplete } from "@/features/Generateotp/presentation/hooks/useGenerateOtpComplete";
import { useGenerateOtp } from "@/features/Generateotp/presentation/hooks/useGenerateOtp";
import { toast } from "react-toastify";
import OtpModal from "@/components/common/CommonOtpModal";
import type { LocalBooking } from "../../domain/entities/loadbooking";
import { getActivityMap } from "../utils/activitymap";
import { useSocketTimelineJobTracking } from "../utils/useSocketTimelineJobTracking";
import { buildJobTrackingSteps } from "../utils/buildJobTrackingSteps";
// import { useServices } from "@/features/Bookings/presentation/hooks/useServices";

export default function JobTrackingTimeline({
  booking,
  loading,
}: {
  booking: Booking | null;
  loading: boolean;
}) {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const { t } = useLanguage();
  const { accessToken } = useAuthStore();

  const timelineRef = useRef<HTMLDivElement>(null);

  const [localBooking, setLocalBooking] = useState<LocalBooking | null>(null);

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpData, setOtpData] = useState<string | number>("");
  const [otpPurpose, setOtpPurpose] = useState("");

  // const { services } = useServices();
  const verifyPaymentMutation = useVerifyPayment();
  const generateOtpMutation = useGenerateOtp();
  const generateCompletedOtpMutation = useGenerateOtpComplete();

  // -----------------------------
  // INIT BOOKING
  // -----------------------------
  useEffect(() => {
    if (!booking) return;

    setLocalBooking((prev: any) => ({
      ...booking,
      activities: prev?.activities?.length
        ? prev.activities
        : booking.activities,
    }));
  }, [booking]);

  // -----------------------------
  // SOCKET INIT
  // -----------------------------
  useEffect(() => {
    if (accessToken) initializeSocket(accessToken);
  }, [accessToken]);

  useSocketTimelineJobTracking({
    bookingId,
    setLocalBooking,
  });

  // -----------------------------
  // ACTIVITY MAP
  // -----------------------------
  const activityMap = useMemo(() => {
    return getActivityMap(localBooking?.activities);
  }, [localBooking?.activities]);

  // -----------------------------
  // STEPS
  // -----------------------------
  const steps = useMemo(() => {
    if (!localBooking) return [];
    return buildJobTrackingSteps({
      localBooking,
      activityMap,
    });
  }, [localBooking, activityMap]);

  // -----------------------------
  // PRICE
  // -----------------------------
  const computedPrice = useMemo(() => {
    return (
      localBooking?.invoice?.finalAmount ??
      localBooking?.totalCost ??
      0
    );
  }, [localBooking]);

  // -----------------------------
  // SERVICE NAME
  // -----------------------------
 

  // -----------------------------
  // OTP START
  // -----------------------------
  const handleStartOtp = () => {
    if (!localBooking?._id) return;

    generateOtpMutation.mutate(
      { bookingId: localBooking._id, purpose: "WORK_START" },
      {
        onSuccess: (data) => {
          setOtpData(data?.otp ?? "");
          setOtpPurpose("Work Start OTP");
          setOtpModalOpen(true);
        },
        onError: () => toast.error("Failed to generate start OTP"),
      }
    );
  };

  // -----------------------------
  // OTP COMPLETE
  // -----------------------------
  const handleCompleteOtp = () => {
    if (!localBooking?._id) return;

    generateCompletedOtpMutation.mutate(
      { bookingId: localBooking._id, purpose: "WORK_COMPLETE" },
      {
        onSuccess: (data) => {
          setOtpData(data?.otp ?? "");
          setOtpPurpose("Work Complete OTP");
          setOtpModalOpen(true);
        },
        onError: () => toast.error("Failed to generate completion OTP"),
      }
    );
  };

  // -----------------------------
  // SCROLL ACTIVE STEP
  // -----------------------------
  useEffect(() => {
    const el = timelineRef.current?.querySelector(".active");
    if (el) {
      (el as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [steps]);

  // -----------------------------
  // LOADING / EMPTY
  // -----------------------------
  if (loading) return <div>Loading...</div>;
  if (!localBooking) return <div>No booking found</div>;

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="bg-white rounded-2xl p-7 border shadow-sm">
      <div className="flex justify-between mb-6">
        <h2 className="text-lg font-bold">
          {t.jobtrackingpage.sections.serviceProgress}
        </h2>

        <div className="px-3 py-1 bg-emerald-100 text-emerald-600 text-xs rounded-full">
          {localBooking.status}
        </div>
      </div>

      <div className="relative pl-10" ref={timelineRef}>
        <div className="absolute left-2 top-2 bottom-0 w-0.5 bg-gray-200" />

        {steps.map((step, idx) => (
          <div key={idx} className="relative pb-7">
            <div
              className={`absolute -left-8 w-5 h-5 rounded-full ${
                step.status === "completed"
                  ? "bg-green-500"
                  : step.status === "active"
                  ? "bg-blue-600 animate-pulse active"
                  : "bg-gray-300"
              }`}
            />

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-semibold">{step.title}</div>
              <div className="text-sm text-gray-500">{step.time}</div>

              {step.showStartOtpButton && (
                <button
                  onClick={handleStartOtp}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Start Work OTP
                </button>
              )}

              {step.showCompleteOtpButton && (
                <button
                  onClick={handleCompleteOtp}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
                >
                  Complete Work OTP
                </button>
              )}

              {step.showPaymentButton && (
                <button
                  onClick={() =>
                    navigate("/payment", {
                      state: {
                        bookingId: localBooking._id,
                        serviceName:localBooking?.serviceId?.name,
                        price: computedPrice,
                        currency: localBooking.currency,
                      },
                    })
                  }
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                >
                  Pay Now
                </button>
              )}

              {step.showVerifyButton && (
                <button
                  onClick={() => {
                    verifyPaymentMutation.mutate(
                      {
                        paymentId: localBooking.paymentId,
                        status: "SUCCESS",
                        transactionId: localBooking.transactionId ?? "",
                      },
                      {
                        onSuccess: () => {
                          navigate("/payment-callback", {
                            state: {
                              bookingId: localBooking._id,
                              status: "SUCCESS",
                            },
                          });
                        },
                        onError: () => {
                          toast.error("Payment verification failed");
                        },
                      }
                    );
                  }}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                >
                  Verify Payment
                </button>
              )}

              {step.showServiceRatingButton && (
                <button
                  onClick={() =>
                    navigate(`/servicerating/${localBooking._id}`)
                  }
                  className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded"
                >
                  Rate Service
                </button>
              )}
            </div>
          </div>
        ))}

        <OtpModal
          isOpen={otpModalOpen}
          otpData={otpData}
          purpose={otpPurpose}
          onClose={() => setOtpModalOpen(false)}
        />
      </div>
    </div>
  );
}