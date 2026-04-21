export interface GenerateInvoice {
  _id?: string;
  bookingId: string | { _id: string }; // depends on backend populate
  invoiceNumber?: string;

  originalAmount?: number;

  vatRate?: number;
  vatAmount?: number;

  finalAmount?: number;

  workerPoolAmount?: number;
  commissionAmount?: number;

  currency?: string;

  actualWorkHours?: number;
  actualWorkDays?: number;

  status?: "PENDING" | "PAID" | "CANCELLED";

  generatedAt?: string;
  paidAt?: string | null;

  createdAt?: string;
  updatedAt?: string;
}