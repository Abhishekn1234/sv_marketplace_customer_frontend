import { formatText } from "@/components/utils/formattext";

type TimelineStatusInput = {
  status?: string | null;
  invoice?: unknown;
  invoiceId?: string | null;
  paymentId?: string | null;
  sessionId?: string | null;
  transactionId?: string | null;
};

export function resolveTimelineStatus(
  status?: string | null,
  bookingLike?: TimelineStatusInput | null
): string {
  const normalizedStatus = status ?? bookingLike?.status ?? "";

  const hasInvoice = Boolean(
    bookingLike?.invoice || bookingLike?.invoiceId
  );

  const hasPayment = Boolean(
    bookingLike?.paymentId ||
      bookingLike?.sessionId ||
      bookingLike?.transactionId
  );

  let resolvedStatus = normalizedStatus;

  switch (normalizedStatus) {
    case "WORK_COMPLETE_OTP_GENERATED":
      resolvedStatus = "WORK_COMPLETED_PENDING";
      break;

    case "WORK_START_OTP_GENERATED":
      resolvedStatus = "WORKER_ACCEPTED";
      break;

    case "COMPLETED":
      if (hasPayment) {
        resolvedStatus = "PAID";
      } else if (hasInvoice) {
        resolvedStatus = "INVOICE_GENERATED";
      } else {
        resolvedStatus = "WORK_COMPLETED_PENDING";
      }
      break;

    case "PAYMENT_COMPLETED":
      resolvedStatus = "PAID";
      break;

    case "PAYMENT_INITIATED":
      resolvedStatus = "PAYMENT_PENDING";
      break;

    case "INVOICE_GENERATED":
      resolvedStatus = "INVOICE_GENERATED";
      break;
  }

  return formatText(resolvedStatus);
}