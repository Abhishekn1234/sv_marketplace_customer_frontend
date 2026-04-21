import { BookingStatus } from "@/features/Bookings/domain/entities/bookingstatus.types";

export const normalizeStatus = (type: string) => {
  switch (type) {
    // -----------------------------
    // CREATED / REQUEST FLOW
    // -----------------------------
    case BookingStatus.REQUESTED:
      return "pending";

    case BookingStatus.WORKER_ACCEPTED:
      return "progress";

    case BookingStatus.WORKER_REJECTED:
    case BookingStatus.CUSTOMER_REJECTED:
      return "cancelled";

    // -----------------------------
    // WORK FLOW
    // -----------------------------
    case BookingStatus.WORK_STARTED:
      return "progress";

    case BookingStatus.IN_PROGRESS:
      return "progress";

    case BookingStatus.WORK_COMPLETED_BY_WORKER:
      return "completed";

    case BookingStatus.WORK_COMPLETED_PENDING:
      return "progress";

    case BookingStatus.COMPLETED:
      return "completed";

    // -----------------------------
    // CANCEL FLOW
    // -----------------------------
    case BookingStatus.WORKER_CANCELLED:
    case BookingStatus.CUSTOMER_CANCELLED:
      return "cancelled";

    // -----------------------------
    // PAYMENT FLOW
    // -----------------------------
    case BookingStatus.INVOICE_GENERATED:
      return "pending";

    case BookingStatus.PAYMENT_PENDING:
      return "pending";

    case BookingStatus.PAID:
      return "completed";

    // -----------------------------
    // DEFAULT
    // -----------------------------
    default:
      return "pending";
  }
};