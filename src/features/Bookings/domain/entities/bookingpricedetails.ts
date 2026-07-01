export interface TaxLine {
  name: string;
  taxType: "VAT" | "GST" | string;
  rate: number;
  taxableAmount: number;
  amount: number;
}

export interface BookingValueBreakdown {
  workHours: number;
  workDays: number;
  noOfWorkers: number;
  amount: number;
  serviceFee: number;
  discountAmount: number;
  taxableAmount: number;
  vatRate: number;
  vatAmount: number;
  taxLines: TaxLine[];
  commissionAmount: number;
  workerPoolAmount: number;
  finalAmount: number;
  appliedDiscounts: any[];
}

export interface BookingDetails {
  estimatedValues: BookingValueBreakdown;
  actualValues: BookingValueBreakdown;
}