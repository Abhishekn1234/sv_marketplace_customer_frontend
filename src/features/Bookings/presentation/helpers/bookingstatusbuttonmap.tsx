import type { BookingHistory } from "../../domain/entities/bookinghistory.types";
import type { BookingStatus } from "../../domain/entities/bookingstatus.types";

export const getBookingButtonConfig = (booking: BookingHistory) => {
  const status = booking.status as BookingStatus; 

  if (status === "IN_PROGRESS" || status === "REQUESTED") {
    return { label: "Track", clickable: true };
  }

  if (status === "WORKER_ACCEPTED") return { label: "Reschedule", clickable: false };

  if (status === "CUSTOMER_CANCELLED" || status === "WORKER_CANCELLED" || status === "WORKER_REJECTED") {
    return { label: "Cancelled", clickable: false };
  }

  if (status === "COMPLETED") return { label: "Completed", clickable: false };
  if (status === "INVOICE_GENERATED") return { label: "Invoice", clickable: true };
  if (status === "WORK_COMPLETED_PENDING") return { label: "Pending Completion", clickable: false };
  if (status === "PAYMENT_PENDING") return { label: "Payment Pending", clickable: false };
  if (status === "PAID") return { label: "Paid", clickable: false };
  if (status === "CUSTOMER_REJECTED") return { label: "Rejected", clickable: false };

  return { label: "Rebook", clickable: false };
};