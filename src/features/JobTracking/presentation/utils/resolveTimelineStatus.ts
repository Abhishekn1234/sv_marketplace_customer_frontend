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
  const hasInvoice = Boolean(bookingLike?.invoice || bookingLike?.invoiceId);
  const hasPayment = Boolean(
    bookingLike?.paymentId || bookingLike?.sessionId || bookingLike?.transactionId
  );

  if (normalizedStatus === "WORK_COMPLETE_OTP_GENERATED") {
    return "WORK_COMPLETED_PENDING";
  }

  if (normalizedStatus === "WORK_START_OTP_GENERATED") {
    return "WORKER_ACCEPTED";
  }

  if (normalizedStatus === "COMPLETED") {
    if (hasPayment) return "PAID";
    if (hasInvoice) return "INVOICE_GENERATED";
    return "WORK_COMPLETED_PENDING";
  }

  if (normalizedStatus === "PAYMENT_COMPLETED") {
    return "PAID";
  }

  if (normalizedStatus === "PAYMENT_INITIATED") {
    return "PAYMENT_PENDING";
  }

  if (normalizedStatus === "INVOICE_GENERATED") {
    return "INVOICE_GENERATED";
  }

  return normalizedStatus;
}
