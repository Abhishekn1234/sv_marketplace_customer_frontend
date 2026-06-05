import type { Activity } from "../../domain/entities/jobtimelineactivities";
import type { LocalBooking } from "../../domain/entities/loadbooking";
import { STEP_CONFIG } from "../utils/stepconfig";
import { formatDates } from "@/features/Home/presentation/helpers/formatdatestring";

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

  const hiddenSteps = [
    "WORKER_CANCELLED",
    "CUSTOMER_CANCELLED",
    "EXPIRED",
  ];

  const filteredSteps = STEP_CONFIG.filter(
    (step) => !hiddenSteps.includes(step.key)
  );

  const singleStepOnly = hiddenSteps;

  // ❗ SHOW ONLY SINGLE STEP FOR TERMINAL STATUSES
  if (singleStepOnly.includes(currentStatus)) {
    const step = STEP_CONFIG.find((s) => s.key === currentStatus);
    if (!step) return [];

    const activity = activityMap?.[step.key];

    const time =
      activity?.createdAt
        ? formatDates(activity.createdAt)
        : localBooking.createdAt
        ? formatDates(localBooking.createdAt)
        : "Pending";

    return [
      {
        key: step.key,
        title: step.title,
        time,
        status: "active",
        showStartOtpButton: false,
        showCompleteOtpButton: false,
        showPaymentButton: false,
        showVerifyButton: false,
        showServiceRatingButton: false,
      },
    ];
  }

  // NORMAL FLOW (WITHOUT CANCELLED/EXPIRED STEPS)
  const currentStepIndex = Math.max(
    filteredSteps.findIndex((s) => s.key === currentStatus),
    0
  );

  return filteredSteps.map((step, idx) => {
    const activity = activityMap?.[step.key];

    const time =
      activity?.createdAt
        ? formatDates(activity.createdAt)
        : step.key === "CREATED" && localBooking.createdAt
        ? formatDates(localBooking.createdAt)
        : "Pending";

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
        [
          "WORK_COMPLETED_PENDING",
          "WORK_COMPLETED_BY_WORKER",
        ].includes(localBooking.status),

      showPaymentButton:
        step.key === "INVOICE_GENERATED" &&
        ["INVOICE_GENERATED", "COMPLETED"].includes(localBooking.status),

      showVerifyButton:
        step.key === "PAYMENT_PENDING" &&
        localBooking.status === "PAYMENT_PENDING",

      showServiceRatingButton: localBooking.status === "PAID",
    };
  });
}