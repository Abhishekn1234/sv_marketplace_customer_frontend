"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect, useRef } from "react";
import { initializeSocket } from "@/features/core/Websocket/socket";
import { useVerifyPayment } from "@/features/Payment/presentation/hooks/useVerifyPayment";
import { useGetProcessingPaymentSession } from "@/features/Payment/presentation/hooks/useGetProcessingPaymentSession";
import { useLanguage } from "@/features/context/LanguageContext";
import { useAuthStore } from "@/features/core/store/auth";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";
import { BookingStatus } from "@/features/Bookings/domain/entities/bookingstatus.types";
import type { BookingStatus as BookingStatusType } from "@/features/Bookings/domain/entities/bookingstatus.types";
import { useGenerateOtpComplete } from "@/features/Generateotp/presentation/hooks/useGenerateOtpComplete";
import { useGenerateOtp } from "@/features/Generateotp/presentation/hooks/useGenerateOtp";
import { toast } from "react-toastify";
import OtpModal from "@/components/common/CommonOtpModal";
import { getActivityMap } from "../utils/activitymap";
import CommonCard from "@/components/common/CommonCards";
import { useSocketTimelineJobTracking } from "../utils/useSocketTimelineJobTracking";


import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import { useTranslationMessages } from "../utils/translationMessages";
// import { getErrorMessage } from "../utils/geterrormessage";
import { getSessionRedirectUrl } from "../utils/getsessionredirecturl";
import { getSessionId } from "../utils/getsessionid";

import JobTrackingStepItem from "./JobTrackingStepItem";
import JobTrackingHeaders from "./JobTrackingHeaders";
import { handleApiError } from "@/components/common/ApiError";
import type { LocalBooking } from "../../domain/entities/localbooking";
import { buildJobTrackingSteps } from "../utils/buildJobTrackingSteps";
import { resolveTimelineStatus } from "../utils/resolveTimelineStatus";
import { formatText } from "@/components/utils/formattext";



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
    activities: booking.activities ?? [], 
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
  // console.log(localBooking,booking);

  const verifyPaymentMutation = useVerifyPayment();
 
  const processingPaymentSessionQuery = useGetProcessingPaymentSession(
  bookingId,
  {
    enabled: false, // IMPORTANT
  }
);
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
        bookingId: bookingId ?? "",
        setLocalBooking,
        navigate,
      });

  // ✅ Use localBooking (merged with socket updates) for instant UI display
  // Falls back to booking prop if no socket updates yet
   const currentBooking = localBooking ?? booking;
  //  console.log(currentBooking);
  // -----------------------------
  // ACTIVITY MAP
  // -----------------------------
  const activityMap = useMemo(() => {
    return getActivityMap(currentBooking?.activities);
  }, [currentBooking?.activities]);

  // -----------------------------
  // STEPS
  // -----------------------------
 const displayStatus = useMemo<BookingStatusType>(() => {
  if (!currentBooking) {
    return BookingStatus.REQUESTED;
  }

  if (!otpModalOpen) {
    return resolveTimelineStatus(
      currentBooking.status,
      currentBooking
    ) as BookingStatusType;
  }

  return currentBooking.status as BookingStatusType;
}, [currentBooking, otpModalOpen]);

  const safeBooking = useMemo(() => {
    if (!currentBooking) return null;

    return {
      ...toLocalBooking(currentBooking),
      status: displayStatus,
    };
  }, [currentBooking, displayStatus]);

  const steps = useMemo(() => {
    if (!safeBooking) return [];

    return buildJobTrackingSteps({
      localBooking: safeBooking,
      activityMap,
      t
    });
  }, [safeBooking, activityMap, t]);


  // -----------------------------
  // PRICE
  // -----------------------------
  const computedPrice =currentBooking?.actualValues?.finalAmount ??
   currentBooking?.estimatedValues?.finalAmount;

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
          setLocalBooking((prev) => {
            const bookingToUpdate = prev ?? currentBooking;
            return bookingToUpdate
              ? { ...bookingToUpdate, status: "WORKER_ACCEPTED" }
              : prev;
          });
        },
        onError: (err) =>
         handleApiError(err,translationMessages["Failed Start OTP"])
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
          setLocalBooking((prev) => {
            const bookingToUpdate = prev ?? currentBooking;
            return bookingToUpdate
              ? { ...bookingToUpdate, status: "WORK_COMPLETED_PENDING" }
              : prev;
          });
        },
        onError: (err) =>
          handleApiError(err,translationMessages["Failed Complete OTP"])
      }
    );
  };

 const handleVerifyPayment = async () => {
  if (!currentBooking?._id) return;

      // Cash payment doesn't need payment session
    const cashPayment = currentBooking.payments?.find(
      (pay) => pay.paymentMethod === "CASH"
    );

      if (cashPayment) {
        navigate("/jobcompleted", {
          replace: true,
          state: {
            bookingId: currentBooking._id,
            paymentDone: true,
          },
        });
        return;
      }

  // Online payment flow
  const session =
    (await processingPaymentSessionQuery.refetch()).data ?? null;

  const paymentUrl = getSessionRedirectUrl(session);

  if (paymentUrl) {
    window.location.replace(paymentUrl);
    return;
  }

  const paymentId = session?.paymentId ?? currentBooking.paymentId;
  const sessionId = getSessionId(session) ?? currentBooking.sessionId;

  if (!paymentId) {
    toast.error(translationMessages["Payment Verification Failed"]);
    return;
  }

  verifyPaymentMutation.mutate(
    {
      paymentId,
      status: "SUCCESS",
      transactionId:
        session?.transactionId ??
        sessionId ??
        currentBooking.transactionId ??
        paymentId,
      sessionId,
      session_id: sessionId,
    },
    {
      onSuccess: () => {
        setLocalBooking((prev) =>
          prev ? { ...prev, status: "PAID" } : prev
        );

        navigate("/jobcompleted", {
          replace: true,
          state: {
            bookingId: currentBooking._id,
            paymentDone: true,
          },
        });
      },
      onError: (err) => {
        handleApiError(
          err,
          translationMessages["Payment Verification Failed"]
        );
      },
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
    <JobTrackingHeaders
        title={t.jobtrackingpage.sections.serviceProgress}
        status={formatText(displayStatus)}
    />

      <div className="relative pl-10" ref={timelineRef}>
        <div className="absolute left-2 top-2 bottom-0 w-0.5 bg-gray-200" />

        {steps.map((step, idx) => (
          <JobTrackingStepItem
            key={idx}
            step={step}
            t={t}
            onStartOtp={handleStartOtp}
            onCompleteOtp={handleCompleteOtp}
            onPayNow={() =>
              
              navigate("/payment", {
                state: {
                  bookingId: currentBooking._id,
                  taxableAmount:currentBooking.actualValues?.taxableAmount?? currentBooking.estimatedValues?.taxableAmount,
                  vatAmount:currentBooking?.actualValues?.vatAmount??currentBooking.estimatedValues?.vatAmount,
                  bookingCode:currentBooking.bookingCode,
                  serviceName: currentBooking?.serviceId ?? currentBooking?.service?.name,
                  price: computedPrice,
                  currency: currentBooking.currency,
                },
              })
            }
            onVerifyPayment={handleVerifyPayment}
            onRateService={() => navigate(`/servicerating/${currentBooking._id}`)}
            isVerifyPending={
              verifyPaymentMutation.isPending || processingPaymentSessionQuery.isFetching
            }
          />
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
