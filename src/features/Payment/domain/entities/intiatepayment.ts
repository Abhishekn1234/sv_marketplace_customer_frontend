export const PaymentMethod = {
  CARD: "CARD",
  UPI: "UPI",
  WALLET: "WALLET",
  NET_BANKING: "NET_BANKING",
  CASH: "CASH",
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export interface PaymentInitial {
  bookingId: string;               
  paymentMethod: PaymentMethod;   
  paymentToken?: string;          
  paymentFlowMode?: "ESCROW" | "DIRECT"; 
  initialAmount?: number;          
}

export interface PaymentInitiationResponse {
  success?: boolean;
  message?: string;
  bookingId?: string;
  paymentId?: string;
  transactionId?: string;
  sessionId?: string;
  session_id?: string;
  paymentUrl?: string;
  checkoutUrl?: string;
  redirectUrl?: string;
  url?: string;
}
