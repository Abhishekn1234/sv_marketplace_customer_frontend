import type { BookingStatus } from "@/features/Bookings/domain/entities/bookingstatus.types";

export const progressMap: Record<BookingStatus, number> = {
  REQUESTED: 10,
 WORK_STARTED: 20,
  WORKER_ACCEPTED: 30,
  WORK_COMPLETED_BY_WORKER:50,
  INVOICE_GENERATED:95,
  PAYMENT_PENDING:98,
  CUSTOMER_CANCELLED:0,
  WORKER_CANCELLED:0,
  CUSTOMER_REJECTED:0,
  EXPIRED:0,
  PAID:100,
  WORKER_REJECTED:0,
  IN_PROGRESS: 70,
  WORK_COMPLETED_PENDING: 90,
  COMPLETED: 100,
};