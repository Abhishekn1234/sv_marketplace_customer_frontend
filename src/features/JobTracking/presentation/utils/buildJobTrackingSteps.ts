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

  const currentStepIndex = Math.max(
    STEP_CONFIG.findIndex((s) => s.key === currentStatus),
    0
  );

  return STEP_CONFIG.map((step, idx) => {
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
        [
             "INVOICE_GENERATED",
             "COMPLETED",
        ].includes(localBooking.status),
       

     showVerifyButton:
  step.key === "PAYMENT_INITIATED" &&
  localBooking.status === "PAYMENT_PENDING",

      showServiceRatingButton:
        localBooking.status === "PAID",
    };
  });
}