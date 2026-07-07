
import { formatDates } from "@/components/utils/formatdates";
import type { Activity } from "../../domain/entities/jobtimelineactivities";
import type { LocalBooking } from "../../domain/entities/localbooking";


const TIME_FALLBACK_MAP: Record<string, string[]> = {
  WORK_STARTED: ["WORK_STARTED", "IN_PROGRESS"],
  IN_PROGRESS: ["WORK_STARTED", "IN_PROGRESS"],
  WORK_COMPLETED_PENDING:["WORK_COMPLETED_PENDING","WORK_COMPLETED_BY_WORKER"],
  PAID: ["PAID", "COMPLETED"],
  COMPLETED: ["PAID", "COMPLETED"],
};
export function getStepTime(stepKey: string, activityMap: Record<string, Activity>, localBooking: LocalBooking) {
  const fallbackKeys = TIME_FALLBACK_MAP[stepKey] || [stepKey];

  for (const key of fallbackKeys) {
    const activity = activityMap?.[key];
    if (activity?.createdAt) {
      return formatDates(activity.createdAt);
    }
  }

  if (stepKey === "CREATED" && localBooking.createdAt) {
    return formatDates(localBooking.createdAt);
  }

  return "Pending";
}