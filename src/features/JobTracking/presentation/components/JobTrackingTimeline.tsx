"use client";


import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect, useRef } from "react";
import { formatDates } from "@/features/Home/presentation/helpers/formatdatestring";

import { getSocket, initializeSocket } from "@/features/core/Websocket/socket";
import { useVerifyPayment } from "@/features/Payment/presentation/hooks/useVerifyPayment";
import { useLanguage } from "@/features/context/LanguageContext";
import { useAuthStore } from "@/features/core/store/auth";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";



export default function JobTrackingTimeline({bookings,loading}:{bookings:Booking[],loading:boolean}) {
 
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [localBooking, setLocalBooking] = useState<any>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [hasRated, setHasRated] = useState(false);

  const verifyPaymentMutation = useVerifyPayment();
  const { t } = useLanguage();
  const { accessToken } = useAuthStore();

  // ✅ Normalize backend types
  const normalizeType = (type: string) => {
    switch (type) {
      case "WORK_STARTED":
      case "IN_PROGRESS":
      case "WORK_START_OTP_GENERATED":
        return "WORK_STARTED";

      case "WORK_COMPLETED_BY_WORKER":
      case "WORK_COMPLETED_PENDING":
      case "COMPLETED":
        return "WORK_COMPLETED_BY_WORKER";

      case "PAYMENT_COMPLETED":
        return "PAID";

      default:
        return type;
    }
  };

  // ✅ Build activities from booking fields
  const buildActivities = (booking: any) => {
    const acts: any[] = [];

    if (booking.createdAt) {
      acts.push({ type: "CREATED", createdAt: booking.createdAt });
    }

    if (booking.assignedWorkers?.length) {
      acts.push({
        type: "WORKER_ACCEPTED",
        createdAt: booking.assignedWorkers[0]?.assignedAt,
      });
    }

    if (booking.startedAt) {
      acts.push({ type: "WORK_STARTED", createdAt: booking.startedAt });
    }

    if (booking.completedAt) {
      acts.push({
        type: "WORK_COMPLETED_BY_WORKER",
        createdAt: booking.completedAt,
      });
    }

    return acts;
  };

  // ✅ Step config
  const STEP_CONFIG = [
    { key: "CREATED", title: "Booking Confirmed" },
    { key: "WORKER_ACCEPTED", title: "Professional Assigned" },
    { key: "WORK_STARTED", title: "Service Started" },
    { key: "WORK_COMPLETED_BY_WORKER", title: "Service Completed" },
    { key: "INVOICE_GENERATED", title: "Invoice Generated" },
    { key: "PAYMENT_INITIATED", title: "Payment Initiated" },
    { key: "PAID", title: "Payment Done" },
  ];

  // ✅ Load booking + hydrate activities
useEffect(() => {
  if (!bookings || !bookingId) return;

  const found = bookings.find((b) => b._id === bookingId);

  if (found) {
    setLocalBooking({
      ...found,
      activities: buildActivities(found),
    });
  }
}, [bookings]);

  // ✅ Init socket
  useEffect(() => {
    if (!accessToken) return;
    initializeSocket(accessToken);
  }, [accessToken]);

  // ✅ Socket merge (SAFE)
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !bookingId) return;

    const handler = (_event: string, data: any) => {
      if (data.bookingId !== bookingId) return;

      setLocalBooking((prev: any) => {
        if (!prev) return prev;

        const newType = normalizeType(data.status);

        const exists = prev.activities?.some(
          (a: any) => normalizeType(a.type) === newType
        );

        if (exists) return prev;

        return {
          ...prev,
          activities: [
            ...(prev.activities || []),
            {
              type: newType,
              createdAt:
                data.occurredAt || new Date().toISOString(),
            },
          ],
          status: newType || prev.status,
        };
      });
    };

    socket.onAny(handler);

    return () => {
      socket.offAny(handler);
    };
  }, [bookingId]);

  // ✅ Build timeline steps
  const steps = useMemo(() => {
    if (!localBooking) return [];

    const currentStepIndex = STEP_CONFIG.findIndex(
      (step) => step.key === normalizeType(localBooking?.status)
    );

    const activities = [...(localBooking?.activities || [])].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );

    return STEP_CONFIG.map((step, idx) => {
      const activity = [...activities]
        .reverse()
        .find((a: any) => normalizeType(a.type) === step.key);

      const isCompleted = idx < currentStepIndex;
      const isActive = idx === currentStepIndex;

      return {
        title: step.title,

        // ✅ STRICT TIME (no fallback bug)
        time: activity
          ? formatDates(activity.createdAt)
          : "Pending",

        status: isCompleted
          ? "completed"
          : isActive
          ? "active"
          : "pending",

        showPaymentButton:
          step.key === "INVOICE_GENERATED" &&
          localBooking?.status === "INVOICE_GENERATED",

        showVerifyButton:
          step.key === "PAID" &&
          localBooking?.status === "PAYMENT_PENDING",

        showServiceRatingButton:
          step.key === "PAID" &&
          localBooking?.status === "PAID",
      };
    });
  }, [localBooking]);

  // ✅ Auto scroll
  useEffect(() => {
    if (!timelineRef.current) return;

    const firstActive =
      timelineRef.current.querySelector(".active");

    if (firstActive) {
      (firstActive as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [steps]);

  if (!localBooking || loading) return null;

  return (
    <div className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-7">
        <h2 className="text-lg font-bold text-gray-900">
          {t.jobtrackingpage.sections.serviceProgress}
        </h2>

        <div className="px-4 py-1 bg-emerald-100 text-emerald-600 text-xs font-semibold rounded-full">
          {localBooking.status}
        </div>
      </div>

      <div className="relative pl-10 overflow-hidden" ref={timelineRef}>
        <div className="absolute left-2 top-2 bottom-10 w-0.5 bg-gray-200"></div>

        {steps.map((step, idx) => {
          const dotClasses =
            step.status === "completed"
              ? "bg-emerald-500"
              : step.status === "active"
              ? "bg-blue-600 animate-pulse active"
              : "bg-gray-200";

          return (
            <div key={idx} className="relative pb-7">
              <div
                className={`absolute -left-8 top-1 w-6 h-6 rounded-full border-2 border-white shadow-sm ${dotClasses}`}
              />

              <div className="bg-gray-50 border rounded-xl p-4">
                <div className="text-sm font-semibold mb-1">
                  {step.title}
                </div>

                <div className="text-xs text-gray-500 mb-2">
                  {step.time}
                </div>

                {step.showPaymentButton && (
                  <button
                    onClick={() =>
                      navigate("/payment", {
                        state: {
                          bookingId: localBooking._id,
                          serviceName:
                            localBooking.service?.name ?? "Service",
                          price: localBooking.totalCost,
                          currency: "₹",
                        },
                      })
                    }
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Pay Now
                  </button>
                )}

                {step.showVerifyButton && (
                  <button
                    onClick={() => {
                      verifyPaymentMutation.mutate(
                        localBooking.paymentId,
                        {
                          onSuccess: () => {
                            setLocalBooking((prev: any) => ({
                              ...prev,
                              status: "PAID",
                            }));
                          },
                        }
                      );
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg mt-2"
                  >
                    Verify Payment
                  </button>
                )}

                {step.showServiceRatingButton && (
                  <button
                    onClick={() => {
                      if (!hasRated) {
                        setHasRated(true);
                        navigate(`/servicerating/${localBooking._id}`);
                      } else {
                        navigate("/bookings");
                      }
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg mt-2"
                  >
                    Rate Service
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}