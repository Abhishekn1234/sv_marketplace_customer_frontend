"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect, useRef } from "react";
import { formatDates } from "@/features/Home/presentation/helpers/formatdatestring";

import { getSocket, initializeSocket } from "@/features/core/Websocket/socket";
import { useVerifyPayment } from "@/features/Payment/presentation/hooks/useVerifyPayment";
import { useLanguage } from "@/features/context/LanguageContext";
import { useAuthStore } from "@/features/core/store/auth";

import type { Booking } from "@/features/Bookings/domain/entities/booking.types";

import { useGenerateOtpComplete } from "@/features/Generateotp/presentation/hooks/useGenerateOtpComplete";
import { useGenerateOtp } from "@/features/Generateotp/presentation/hooks/useGenerateOtp";

import { toast } from "react-toastify";
import OtpModal from "@/components/common/CommonOtpModal";
import type { Activity } from "../../domain/entities/jobtimelineactivities";
type LocalBooking = Booking & {
  activities: Activity[];
};

export default function JobTrackingTimeline({
  bookings,
  loading,
}: {
  bookings: Booking[];
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

  const verifyPaymentMutation = useVerifyPayment();
  const generateOtpMutation = useGenerateOtp();
  const generateCompletedOtpMutation = useGenerateOtpComplete();

  // ---------------- LOAD BOOKING ----------------
  useEffect(() => {
    if (!bookings || !bookingId) return;

    const found = bookings.find((b) => b._id === bookingId);

    if (found) {
      setLocalBooking({
        ...(found as any),
        activities: [],
      });
    }
  }, [bookings, bookingId]);

  // ---------------- SOCKET INIT ----------------
  useEffect(() => {
    if (accessToken) initializeSocket(accessToken);
  }, [accessToken]);

  // ---------------- SOCKET EVENTS ----------------
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !bookingId) return;

    const handler = (data: any) => {
      const booking = data.booking ?? data;
      if (!booking?._id || booking._id !== bookingId) return;

      const eventName = data.eventName;
      const rawStatus = data.status || booking.status;

      let mappedStatus = rawStatus;

      switch (eventName) {
        case "booking.worker.accepted":
          mappedStatus = "WORKER_ACCEPTED";
          break;
        case "booking.work-start-otp.generated":
          mappedStatus = "WORK_STARTED";
          break;
        case "booking.work.started":
          mappedStatus = "IN_PROGRESS";
          break;
        case "booking.work.completed-by-worker":
          mappedStatus = "WORK_COMPLETED_BY_WORKER";
          break;
        case "booking.completion-otp.generated":
          mappedStatus = "WORK_COMPLETED_PENDING";
          break;
        case "booking.completion.confirmed":
        case "booking.invoice.generated":
          mappedStatus = "INVOICE_GENERATED";
          break;
      }

      const activity: Activity = {
        type: mappedStatus,
        createdAt:
          data.occurredAt ||
          booking?.createdAt ||
          new Date().toISOString(),
      };

      setLocalBooking((prev) => {
        if (!prev) return prev;

        const exists = prev.activities?.some(
          (a) =>
            a.type === activity.type &&
            Math.abs(
              new Date(a.createdAt).getTime() -
                new Date(activity.createdAt).getTime()
            ) < 1000
        );

        return {
          ...prev,
          status: mappedStatus,
          activities: exists
            ? prev.activities
            : [...(prev.activities || []), activity],
        };
      });
    };

    socket.on("booking.created", handler);
    socket.on("booking:update", handler);
    socket.on("booking.worker.accepted", handler);
    socket.on("booking.work.started", handler);
    socket.on("booking.work.completed-by-worker", handler);
    socket.on("booking.completion-otp.generated", handler);
    socket.on("booking.completion.confirmed", handler);
    socket.on("booking.invoice.generated", handler);

    return () => {
      socket.off("booking.created", handler);
      socket.off("booking:update", handler);
      socket.off("booking.worker.accepted", handler);
      socket.off("booking.work.started", handler);
      socket.off("booking.work.completed-by-worker", handler);
      socket.off("booking.completion-otp.generated", handler);
      socket.off("booking.completion.confirmed", handler);
      socket.off("booking.invoice.generated", handler);
    };
  }, [bookingId]);

  // ---------------- STEP CONFIG ----------------
  const STEP_CONFIG = [
    { key: "CREATED", title: "Booking Confirmed" },
    { key: "WORKER_ACCEPTED", title: "Professional Assigned" },
    { key: "WORK_STARTED", title: "Work Started" },
    { key: "IN_PROGRESS", title: "In Progress" },
    { key: "WORK_COMPLETED_PENDING", title: "Waiting Completion OTP" },
    { key: "WORK_COMPLETED_BY_WORKER", title: "Completed by Worker" },
    { key: "INVOICE_GENERATED", title: "Invoice Generated" },
    { key: "PAYMENT_PENDING", title: "Payment Pending" },
    { key: "PAID", title: "Payment Done" },
  ];

  // ---------------- ACTIVITY MAP ----------------
  const activityMap = useMemo(() => {
    if (!localBooking?.activities) return {};

    return localBooking.activities.reduce((acc, a) => {
      acc[a.type] = acc[a.type]
        ? new Date(a.createdAt) > new Date(acc[a.type].createdAt)
          ? a
          : acc[a.type]
        : a;

      return acc;
    }, {} as Record<string, Activity>);
  }, [localBooking]);

  // ---------------- STEPS ----------------
  const steps = useMemo(() => {
    if (!localBooking) return [];

    const currentStatus = localBooking.status;

    const currentStepIndex = Math.max(
      STEP_CONFIG.findIndex((s) => s.key === currentStatus),
      0
    );

    return STEP_CONFIG.map((step, idx) => {
      const activity = activityMap[step.key];

      const time = (() => {
        if (activity?.createdAt) {
          return formatDates(activity.createdAt);
        }

        if (step.key === "CREATED" && localBooking.createdAt) {
          return formatDates(localBooking.createdAt);
        }

        return "Pending";
      })();

      return {
        key: step.key,
        title: step.title,
        time,

        status:
          idx < currentStepIndex
            ? "completed"
            : idx === currentStepIndex
            ? "active"
            : "pending",

        showStartOtpButton:
          step.key === "WORKER_ACCEPTED" &&
          localBooking.status === "WORKER_ACCEPTED",

        showCompleteOtpButton:
          step.key === "WORK_COMPLETED_PENDING" &&
          localBooking.status === "WORK_COMPLETED_PENDING",

        showPaymentButton:
          step.key === "INVOICE_GENERATED" &&
          localBooking.status === "INVOICE_GENERATED",

        showVerifyButton:
          localBooking.status === "PAYMENT_PENDING",

        showServiceRatingButton:
          localBooking.status === "PAID",
      };
    });
  }, [localBooking, activityMap]);

  // ---------------- OTP HANDLERS ----------------
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

  // ---------------- AUTO SCROLL ----------------
  useEffect(() => {
    const el = timelineRef.current?.querySelector(".active");
    if (el) {
      (el as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [steps]);

  // ---------------- UI ----------------
  if (loading) return <div>Loading...</div>;
  if (!localBooking) return <div>No booking found</div>;

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
                        serviceName: localBooking.service?.name ?? "Service",
                        price: localBooking.totalCost,
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
                    if (!localBooking?._id) return;

                    verifyPaymentMutation.mutate(
                      {
                        paymentId: localBooking.paymentId,
                        status: "SUCCESS",
                        transactionId:
                          localBooking.transactionId ?? "",
                      },
                      {
                        onSuccess: () =>
                          toast.success("Payment verified successfully"),
                        onError: () =>
                          toast.error("Payment verification failed"),
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