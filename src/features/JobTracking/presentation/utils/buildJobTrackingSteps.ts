import type { Activity } from "../../domain/entities/jobtimelineactivities";
import type { LocalBooking } from "../../domain/entities/localbooking";
import { getStepConfig } from "./stepconfig";


import { getStepTime } from "./timemapping";

interface Params {
  localBooking: LocalBooking;
  activityMap: Record<string, Activity>;
  t:any;
}

export function buildJobTrackingSteps({
  localBooking,
  activityMap,
  t
}: Params) {
  if (!localBooking) return [];

  const currentStatus = localBooking.status;

  const TERMINAL_STATUSES = [
    "WORKER_CANCELLED",
    "CUSTOMER_CANCELLED",
    "EXPIRED",
  ];
 const STEP_CONFIG = getStepConfig(t);
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

  const normalizedStatus =
    currentStatus === "WORK_COMPLETE_OTP_GENERATED"
      ? "WORK_COMPLETED_PENDING"
      : currentStatus === "WORK_START_OTP_GENERATED"
      ? "WORKER_ACCEPTED"
      : currentStatus;

  const currentIndex = STEP_CONFIG.findIndex(
    (s) => s.key === normalizedStatus
  );

  return filteredSteps.map((step) => {
    const stepIndex = STEP_CONFIG.findIndex((s) => s.key === step.key);
    const time = getStepTime(step.key, activityMap, localBooking);

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
        normalizedStatus === "WORKER_ACCEPTED",

      showCompleteOtpButton:
        step.key === "WORK_COMPLETED_PENDING" &&
        (
          normalizedStatus === "WORK_COMPLETED_BY_WORKER" ||
          normalizedStatus === "WORK_COMPLETED_PENDING"
        ),

      // PAYMENT FLOW
      showPaymentButton:
        step.key === "INVOICE_GENERATED" &&
        normalizedStatus === "INVOICE_GENERATED",

      showVerifyButton:
        step.key === "PAYMENT_PENDING" &&
        normalizedStatus === "PAYMENT_PENDING",

      // FINAL
      showServiceRatingButton:
        step.key === "PAID" &&
        normalizedStatus === "PAID",
    };
  });
}
