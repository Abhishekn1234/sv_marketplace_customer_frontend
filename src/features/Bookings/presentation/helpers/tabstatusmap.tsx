import type { BookingStatus } from "../../domain/entities/bookingstatus.types";

export const tabStatusMap: Record<string, BookingStatus[]> = {
  "In Progress": ["IN_PROGRESS"],
  Completed: ["COMPLETED"],
  Scheduled: ["WORKER_ACCEPTED", "REQUESTED"],
  Requested: ["REQUESTED"],
  Cancelled: ["CUSTOMER_CANCELLED", "WORKER_CANCELLED", "WORKER_REJECTED"],
  "Invoice Generated": ["INVOICE_GENERATED"],
  "Worker Accepted": ["WORKER_ACCEPTED"],
  "Paid":["PAID"]
};