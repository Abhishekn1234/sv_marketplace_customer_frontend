import type { BookingStatus } from "../../domain/entities/bookingstatus.types";

export const tabStatusMap: Record<string, BookingStatus[]> = {
  All: [],

  inProgress: ["IN_PROGRESS"],

  Completed: ["COMPLETED"],

  Requested: ["REQUESTED"],

  Cancelled: [
    "CUSTOMER_CANCELLED",
    "WORKER_CANCELLED",
    "WORKER_REJECTED"
  ],

  InvoiceGenerated: ["INVOICE_GENERATED"],

  WorkerAccepted: ["WORKER_ACCEPTED"],

  Paid: ["PAID"],
  Refunded:["REFUNDED"]
};