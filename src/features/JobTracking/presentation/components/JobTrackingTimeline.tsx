"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect, useRef } from "react";
import { formatDates } from "@/features/Home/presentation/helpers/formatdatestring";
// import { useVerifyPayment } from "@/features/Payment/presentation/hooks/useVerifyPayment";
import { useLanguage } from "@/features/context/LanguageContext";
import { useAuthStore } from "@/features/core/store/auth";
import { initializeSocket } from "@/features/core/Websocket/socket";

export default function JobTrackingTimeline() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const token = useAuthStore((state) => state.accessToken);

  const [localBooking, setLocalBooking] = useState<any>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  // const [hasRated, setHasRated] = useState(false);

  // const verifyPaymentMutation = useVerifyPayment();
  const { t } = useLanguage();

  // -----------------------------
  // SOCKET: CONNECT + LOAD BOOKING
  // -----------------------------
  useEffect(() => {
    if (!token || !bookingId) return;

    const socket = initializeSocket(token);

    // join room
    socket.emit("join_booking", bookingId);

    // 1️⃣ ask server for initial booking
    socket.emit("get_booking", { bookingId });

    // 2️⃣ receive initial booking
    const handleInitial = (booking: any) => {
      if (booking._id !== bookingId) return;
      setLocalBooking(booking);
    };

    // 3️⃣ receive updates
    const handleUpdate = (booking: any) => {
      if (booking._id !== bookingId) return;
      setLocalBooking(booking);
    };

    socket.on("booking_data", handleInitial);
    socket.on("booking_updated", handleUpdate);
    socket.on("worker_assigned", handleUpdate);
    socket.on("payment_updated", handleUpdate);

    return () => {
      socket.off("booking_data", handleInitial);
      socket.off("booking_updated", handleUpdate);
      socket.off("worker_assigned", handleUpdate);
      socket.off("payment_updated", handleUpdate);

      socket.emit("leave_booking", bookingId);
    };
  }, [token, bookingId]);

  // -----------------------------
  // TIMELINE STEPS
  // -----------------------------
  const steps = useMemo(() => {
    if (!localBooking) return [];

    const worker = localBooking.assignedWorkers?.[0];

    if (localBooking.status === "WORKER_CANCELLED") {
      return [
        {
          title: "Booking Confirmed",
          time: formatDates(localBooking.createdAt),
          status: "completed",
        },
        {
          title: "Worker has cancelled",
          time: formatDates(localBooking.updatedAt),
          status: "active",
        },
      ];
    }

    if (localBooking.status === "CUSTOMER_CANCELLED") {
      return [
        {
          title: "Booking Confirmed",
          time: formatDates(localBooking.createdAt),
          status: "completed",
        },
        {
          title: "You have cancelled the booking",
          time: formatDates(localBooking.updatedAt),
          status: "active",
        },
      ];
    }

    return [
      {
        title: "Booking Confirmed",
        time: formatDates(localBooking.createdAt),
        status: "completed",
      },
      {
        title: "Professional Assigned",
        time: formatDates(worker?.assignedAt),
        status: worker?.assignedAt ? "completed" : "pending",
      },
      {
        title: "Service Started",
        time:
          worker?.startedAt ||
          localBooking.status === "IN_PROGRESS" ||
          localBooking.status === "WORK_COMPLETED_PENDING"
            ? formatDates(worker?.startedAt || new Date())
            : "Pending",
        status:
          worker?.startedAt ||
          localBooking.status === "IN_PROGRESS" ||
          localBooking.status === "WORK_COMPLETED_PENDING"
            ? "active"
            : "pending",
      },
      {
        title: "Service Completed",
        time: worker?.completedAt
          ? formatDates(worker.completedAt)
          : "Pending",
        status:
          worker?.completedAt || localBooking.status === "COMPLETED"
            ? "active"
            : "pending",
      },
      {
        title: "Invoice Generated",
        time: localBooking.invoiceId
          ? formatDates(localBooking.updatedAt)
          : "Pending",
        status: localBooking.invoiceId ? "completed" : "pending",
      },
      {
        title: "Payment",
        time:
          localBooking.status === "PAID"
            ? formatDates(localBooking.paymentDate ?? new Date())
            : "Pending",
        status:
          localBooking.status === "PAID"
            ? "completed"
            : localBooking.status === "PAYMENT_PENDING"
            ? "active"
            : "pending",
        showPaymentButton: localBooking.status === "INVOICE_GENERATED",
        showVerifyButton:
          localBooking.status === "PAYMENT_PENDING" &&
          !!localBooking.invoiceId,
      },
      {
        title: "Payment Done",
        time:
          localBooking.status === "PAID"
            ? formatDates(localBooking.paymentDate ?? new Date())
            : "Pending",
        status: localBooking.status === "PAID" ? "active" : "pending",
        showServiceRatingButton: localBooking.status === "PAID",
      },
    ];
  }, [localBooking]);

  // -----------------------------
  // SCROLL ACTIVE STEP
  // -----------------------------
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

  // -----------------------------
  // AMOUNT CALCULATION
  // -----------------------------
  const pricingTier = localBooking?.service?.pricingTiers?.find(
    (tier: any) => tier.tierId === localBooking.serviceTierId
  );

  const calculatedAmount = useMemo(() => {
    if (!localBooking || !pricingTier) return 0;

    if (localBooking.pricingMode === "HOURLY") {
      return (
        (pricingTier?.HOURLY?.ratePerHour ?? 0) *
        (localBooking.actualWorkHours ?? 0)
      );
    }

    if (localBooking.pricingMode === "PER_DAY") {
      return (
        (pricingTier?.PER_DAY?.ratePerDay ?? 0) *
        (localBooking.actualWorkDays ?? 0)
      );
    }

    return 0;
  }, [localBooking, pricingTier]);

  if (!localBooking) {
    return (
      <div className="p-5 text-gray-500">
        Waiting for booking updates...
      </div>
    );
  }

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
          const isLast = idx === steps.length - 1;

          const dotClasses =
            step.status === "completed"
              ? "bg-emerald-500"
              : step.status === "active"
              ? "bg-blue-600 animate-pulse active"
              : "bg-gray-200";

          return (
            <div key={idx} className={`relative pb-7 ${isLast ? "pb-0" : ""}`}>
              <div
                className={`absolute -left-8 top-1 w-6 h-6 rounded-full border-2 border-white shadow-sm ${dotClasses}`}
              />

              <div
                className={`bg-gray-50 border rounded-xl p-4 ${
                  step.status === "active"
                    ? "bg-blue-50 border-blue-600"
                    : "border-gray-200"
                }`}
              >
                <div
                  className={`text-sm font-semibold mb-1 ${
                    step.status === "active"
                      ? "text-blue-600"
                      : "text-gray-900"
                  }`}
                >
                  {step.title}
                </div>

                <div className="text-xs text-gray-500 font-medium mb-2">
                  {step.time}
                </div>

                {step.showPaymentButton && (
                  <button
                    onClick={() =>
                      navigate("/payment", {
                        state: {
                          bookingId: localBooking._id,
                          serviceName: localBooking.service?.name,
                          price: calculatedAmount,
                          currency: localBooking.currency,
                        },
                      })
                    }
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Pay Now
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