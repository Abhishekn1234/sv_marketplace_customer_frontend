import { BookingStatus } from "@/features/Bookings/domain/entities/bookingstatus.types";

export const normalizeStatus = (type: string) => {
  switch (type) {
    case BookingStatus.WORKER_REJECTED:
    case BookingStatus.CUSTOMER_REJECTED:
    case BookingStatus.WORKER_CANCELLED:
    case BookingStatus.CUSTOMER_CANCELLED:
      return "cancelled";

    case BookingStatus.WORKER_ACCEPTED:
    case BookingStatus.WORK_STARTED:
    case BookingStatus.IN_PROGRESS:
    case BookingStatus.WORK_COMPLETED_PENDING:
    case BookingStatus.PAYMENT_PENDING:
      return "progress";

    case BookingStatus.WORK_COMPLETED_BY_WORKER:
    case BookingStatus.COMPLETED:
    case BookingStatus.PAID:
      return "completed";

    default:
      return "progress";
  }
};