import { BookingStatus } from "../../domain/entities/bookingstatus.types";

export const TRACKABLE_STATUSES: BookingStatus[] = [
  "REQUESTED",
  "IN_PROGRESS",
  "WORKER_ACCEPTED",      // add this
  "WORK_COMPLETED_PENDING",
  "COMPLETED",
];