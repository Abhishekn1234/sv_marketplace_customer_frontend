import type { Activity } from "../../domain/entities/jobtimelineactivities";
import type { LocalBooking } from "../../domain/entities/localbooking";
import { STEP_CONFIG } from "../utils/stepconfig";
import { getStepTime } from "./timemapping";

interface Params {
  localBooking: LocalBooking;
  activityMap: Record<string, Activity>;
}

export function buildJobTrackingSteps({
  localBooking,
  activityMap,
}: Params) {
  if (!localBooking) return [];

  const currentStatus = localBooking.status;

  const TERMINAL_STATUSES = [
    "WORKER_CANCELLED",
    "CUSTOMER_CANCELLED",
    "EXPIRED",
  ];

  const filteredSteps = STEP_CONFIG.filter(
    (step) => !TERMINAL_STATUSES.includes(step.key)
  );

  // =========================
  // TERMINAL STATE
  // =========================
  if (TERMINAL_STATUSES.includes(currentStatus)) {
    const step = STEP_CONFIG.find((s) => s.key === currentStatus);
    if (!step) return [];

    return [
      {
        key: step.key,
        title: step.title,
        time: getStepTime(step.key, activityMap, localBooking),
        status: "active",
        showStartOtpButton: false,
        showCompleteOtpButton: false,
        showPaymentButton: false,
        showVerifyButton: false,
        showServiceRatingButton: false,
      },
    ];
  }

  // =========================
  // FIND CURRENT INDEX (IMPORTANT FIX)
  // =========================
  const currentIndex = STEP_CONFIG.findIndex(
    (s) => s.key === currentStatus
  );

  return filteredSteps.map((step) => {
    const stepIndex = STEP_CONFIG.findIndex(
      (s) => s.key === step.key
    );

    const time = getStepTime(step.key, activityMap, localBooking);

    // =========================
    // FINAL CORRECT STATE LOGIC
    // =========================
    const status =
      stepIndex < currentIndex
        ? "completed"
        : stepIndex === currentIndex
        ? "active"
        : "pending";

    return {
      key: step.key,
      title: step.title,
      time,
      status,

      // OTP FLOW
      showStartOtpButton:
        step.key === "WORKER_ACCEPTED" &&
        currentStatus === "WORKER_ACCEPTED",

            showCompleteOtpButton:
        step.key === "WORK_COMPLETED_PENDING" &&
        (
          currentStatus === "WORK_COMPLETED_BY_WORKER" ||
          currentStatus === "WORK_COMPLETED_PENDING"
        ),

      // PAYMENT FLOW
      showPaymentButton:
        step.key === "INVOICE_GENERATED" &&
        currentStatus === "INVOICE_GENERATED",

      showVerifyButton:
        step.key === "PAYMENT_PENDING" &&
        currentStatus === "PAYMENT_PENDING",

      // FINAL
      showServiceRatingButton:
        step.key === "PAID" &&
        currentStatus === "PAID",
    };
  });
}