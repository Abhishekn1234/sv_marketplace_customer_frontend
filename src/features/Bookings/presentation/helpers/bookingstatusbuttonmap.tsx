import type { BookingHistory } from "../../domain/entities/bookinghistory.types";
import type { BookingStatus } from "../../domain/entities/bookingstatus.types";

export const getBookingButtonConfig = (booking: BookingHistory) => {
  const status = booking.status as BookingStatus;

  switch (status) {
    case "IN_PROGRESS":
    case "REQUESTED":
      return { label: "Track", clickable: true };

    case "WORKER_ACCEPTED":
      return { label: "Start Work (OTP)", clickable: true }; // user clicks to generate OTP

    case "WORK_COMPLETED_PENDING":
      return { label: "Complete Work (OTP)", clickable: true }; // user clicks to verify completion OTP

    case "PAYMENT_PENDING":
      return { label: "Verify Payment", clickable: true }; // main button will trigger payment verification

    case "INVOICE_GENERATED":
      return { label: "Invoice", clickable: true };

    case "PAID":
      return { label: "Rate Your Service", clickable: true };

    case "COMPLETED":
      return { label: "Completed", clickable: false };

    case "CUSTOMER_CANCELLED":
    case "WORKER_CANCELLED":
    case "WORKER_REJECTED":
    case "CUSTOMER_REJECTED":
      return { label: "Cancelled / Rejected", clickable: false };

    default:
      return { label: "Rebook", clickable: false };
  }
};