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
import { getActivityMap } from "../utils/activitymap";
import CommonCard from "@/components/common/CommonCards";
import { useSocketTimelineJobTracking } from "../utils/useSocketTimelineJobTracking";
import { buildJobTrackingSteps } from "../utils/buildJobTrackingSteps";
import type { LocalBooking } from "../../domain/entities/loadbooking";
import Button from "@/components/input/Button";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import { useTranslationMessages } from "../utils/translationMessages";

export default function JobTrackingTimeline({
  booking,
  loading,
}: {
  booking: Booking | null;
  loading: boolean;
}) {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
 const toLocalBooking = (booking: Booking): LocalBooking => {
  return {
    ...booking,
    activities: booking.activities ?? [], // IMPORTANT FIX
  };
};
  const { t } = useLanguage();
  const { accessToken } = useAuthStore();

  const timelineRef = useRef<HTMLDivElement>(null);

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpData, setOtpData] = useState<string | number>("");
  const [otpPurpose, setOtpPurpose] = useState("");

  // ✅ Local state for instant socket updates - prevents reloading
  const [localBooking, setLocalBooking] = useState<Booking | null>(null);
 const translationMessages = useTranslationMessages();
  // Initialize local state from prop (only once, no reloading)
  useEffect(() => {
    if (booking && !localBooking) {
      setLocalBooking(booking);
    }
  }, [booking]);
  // console.log(localBooking,booking);

  const verifyPaymentMutation = useVerifyPayment();
  const generateOtpMutation = useGenerateOtp();
  const generateCompletedOtpMutation = useGenerateOtpComplete();


  // -----------------------------
  // SOCKET INIT
  // -----------------------------
  useEffect(() => {
    if (accessToken) initializeSocket(accessToken);
  }, [accessToken]);

// ✅ Socket for real-time activity updates - now passes setLocalBooking for instant UI
  useSocketTimelineJobTracking({
    bookingId,
    setLocalBooking,
    navigate
  });

  // ✅ Use localBooking (merged with socket updates) for instant UI display
  // Falls back to booking prop if no socket updates yet
const currentBooking = localBooking ?? booking;
  // -----------------------------
  // ACTIVITY MAP
  // -----------------------------
  const activityMap = useMemo(() => {
    return getActivityMap(currentBooking?.activities);
  }, [currentBooking?.activities]);

  // -----------------------------
  // STEPS
  // -----------------------------
  const safeBooking = useMemo(() => {
  if (!currentBooking) return null;
  return toLocalBooking(currentBooking);
}, [currentBooking]);
  const steps = useMemo(() => {
  if (!safeBooking) return [];

  return buildJobTrackingSteps({
    localBooking: safeBooking,
    activityMap,
  });
}, [safeBooking, activityMap]);

  // -----------------------------
  // PRICE
  // -----------------------------
  const computedPrice = useMemo(() => {
    return (
      currentBooking?.invoice?.finalAmount ??
      currentBooking?.totalCost ??
      0
    );
  }, [currentBooking]);

  // -----------------------------
  // OTP START
  // -----------------------------
  const handleStartOtp = () => {
    if (!currentBooking?._id) return;

    generateOtpMutation.mutate(
      { bookingId: currentBooking._id, purpose: "WORK_START" },
      {
        onSuccess: (data) => {
          setOtpData(data?.otp ?? "");
          setOtpPurpose(translationMessages["Work Start OTP"]);
          setOtpModalOpen(true);
        },
        onError: (err:any) => toast.error(err.response?.data?.message ||translationMessages["Failed Start OTP"]),
      }
    );
  };

  // -----------------------------
  // OTP COMPLETE
  // -----------------------------
  const handleCompleteOtp = () => {
    if (!currentBooking?._id) return;

    generateCompletedOtpMutation.mutate(
      { bookingId: currentBooking._id, purpose: "WORK_COMPLETE" },
      {
        onSuccess: (data) => {
          setOtpData(data?.otp ?? "");
          setOtpPurpose(translationMessages["Work Completed OTP"]);
          setOtpModalOpen(true);
        },
        onError: (err:any) => toast.error(err.response?.data?.message ||translationMessages["Failed Complete OTP"]),
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
  // Pass false to prevent reloading of content after initial load
  if (loading || !currentBooking) return <div>
    <CommonSpinner size={20}/>
  </div>;

  // -----------------------------
  // UI
  // -----------------------------
   return (
    <CommonCard className="p-7">
      <div className="flex justify-between mb-6">
        <h2 className="text-lg font-bold">
          {t.jobtrackingpage.sections.serviceProgress}
        </h2>

        <div className="px-3 py-1 bg-emerald-100 text-emerald-600 text-xs rounded-full">
          {currentBooking.status}
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
                <Button
                  onClick={handleStartOtp}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                >
                 {t.jobtrackingpage.buttons.startWorkOtp}
                </Button>
              )}

              {step.showCompleteOtpButton && (
                <Button
                  onClick={handleCompleteOtp}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
                >
                  {t.jobtrackingpage.buttons.completeWorkOtp}
                </Button>
              )}

              {step.showPaymentButton && (
                <Button
                  onClick={() =>
                    navigate("/payment", {
                      state: {
                        bookingId: currentBooking._id,
                        serviceName:
                          currentBooking?.serviceId?.name ??
                          currentBooking?.service?.name,
                        price: computedPrice,
                        currency: currentBooking.currency,
                      },
                    })
                  }
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                >
                  {t.jobtrackingpage.buttons.payNow}
                </Button>
              )}

              {step.showVerifyButton && (
                <Button
                  onClick={() => {
                    verifyPaymentMutation.mutate(
                      {
                        paymentId: currentBooking.paymentId,
                        status: "SUCCESS",
                        transactionId: currentBooking.transactionId ?? "",
                      },
                      {
                        onSuccess: () => {
                          navigate("/payment-callback", {
                            state: {
                              bookingId: currentBooking._id,
                              status: "SUCCESS",
                            },
                          });
                        },
                        onError: (err:any) => {
                          
                          toast.error(err?.response?.data?.message || translationMessages["Payment Verification Failed"])

                        },
                      }
                    );
                  }}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                >
                  {t.jobtrackingpage.buttons.verifyPayment}
                </Button>
              )}

              {step.showServiceRatingButton && (
                <Button
                  onClick={() =>
                    navigate(`/servicerating/${currentBooking._id}`)
                  }
                  className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded"
                >
                  {t.jobtrackingpage.buttons.rateService}
                </Button>
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
    </CommonCard>
  );
}
