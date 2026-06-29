import type { ProcessingPaymentSession } from "@/features/Payment/domain/entities/processingpaymentsession";

export const getSessionRedirectUrl = (session: ProcessingPaymentSession | null) =>
  session?.paymentUrl ??
  session?.checkoutUrl ??
  session?.redirectUrl ??
  session?.url;
