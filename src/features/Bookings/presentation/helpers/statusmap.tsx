import type { BookingStatus } from "../../domain/entities/bookingstatus.types";

export const statusStyles: Record<BookingStatus, string> = {
  WORK_COMPLETED_BY_WORKER: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  WORK_STARTED:"bg-gray-100 text-gray-700 border border-gray-300",
  COMPLETED: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  IN_PROGRESS: "bg-blue-50 text-blue-600 border border-blue-200",
  WORKER_ACCEPTED: "bg-amber-50 text-amber-600 border border-amber-200",
  CUSTOMER_CANCELLED: "bg-red-50 text-red-600 border border-red-200",
  WORKER_REJECTED: "bg-blue-100 text-blue-700 border border-blue-300",
  REQUESTED: "bg-gray-50 text-gray-600 border border-gray-200",
  WORKER_CANCELLED: "bg-red-100 text-red-700 border border-red-300",
  WORK_COMPLETED_PENDING: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  INVOICE_GENERATED: "bg-purple-50 text-purple-600 border border-purple-200",
  PAYMENT_PENDING: "bg-orange-50 text-orange-600 border border-orange-200",
  PAID: "bg-green-50 text-green-600 border border-green-200",
  CUSTOMER_REJECTED: "bg-pink-50 text-pink-600 border border-pink-200",
};