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