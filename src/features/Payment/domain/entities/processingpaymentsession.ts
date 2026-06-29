import type { PaymentMethod } from "./intiatepayment";
import type { PaymentStatus } from "./paymentstatus";

export interface ProcessingPaymentSession {
  bookingId?: string;
  paymentId?: string;
  transactionId?: string;
  sessionId?: string;
  session_id?: string;
  paymentMethod?: PaymentMethod | string;
  paymentUrl?: string;
  checkoutUrl?: string;
  redirectUrl?: string;
  url?: string;
  status?: PaymentStatus | "PROCESSING" | "PENDING" | "PAID" | "COMPLETED";
  gatewayResponse?: Record<string, unknown>;
}
