import type { ProcessingPaymentSession } from "@/features/Payment/domain/entities/processingpaymentsession";

export const getSessionId = (session: ProcessingPaymentSession | null) =>
  session?.sessionId ?? session?.session_id;