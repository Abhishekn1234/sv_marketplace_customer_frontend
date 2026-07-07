import { useLanguage } from "@/features/context/LanguageContext";
import type { BookingHistory } from "../../domain/entities/bookinghistory.types";
import type { BookingStatus } from "../../domain/entities/bookingstatus.types";

export const getBookingButtonConfig = (booking: BookingHistory) => {
  const { t } = useLanguage();
  const status = booking.status as BookingStatus;

  switch (status) {
    case "REQUESTED":
    case "IN_PROGRESS":
    case "WORKER_ACCEPTED":
    case "WORK_COMPLETED_PENDING":
      return {
        label: t.Bookingspage.Actions.track,
        clickable: true,
      };
      

    case "PAYMENT_PENDING":
      return {
        label: t.Bookingspage.Actions.verifyPayment,
        clickable: true,
      };

    case "INVOICE_GENERATED":
      return {
        label: t.Bookingspage.Actions.downloadInvoice,
        clickable: true,
      };

    case "PAID":
      return {
        label: t.Bookingspage.Actions["Rate Your Service"],
        clickable: true,
      };

    case "COMPLETED":
      return {
        label: t.Bookingspage.status.Completed,
        clickable: false,
      };

    case "CUSTOMER_CANCELLED":
    case "WORKER_CANCELLED":
    case "WORKER_REJECTED":
    case "CUSTOMER_REJECTED":
      return {
        label: t.Bookingspage.Actions.cancelled,
        clickable: false,
      };

    default:
      return {
        label: t.Bookingspage.Actions.rebook,
        clickable: false,
      };
  }
};