export interface Payment {
  _id: string;
  bookingId: string;
  invoiceId: string;
  userId: string;
  amount: number;
  remainingAmount: number;
  currency: string;
  paymentFlowMode: "ESCROW";
  paymentMethod: "CASH" | "CARD" | "ONLINE" | "WALLET";
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
  initiatedAt: string;
  createdAt: string;
  updatedAt: string;
}