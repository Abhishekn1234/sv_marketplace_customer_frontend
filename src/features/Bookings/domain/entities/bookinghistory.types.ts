
import type { BookingStatus } from "./bookingstatus.types";

import { Booking } from "./booking.types";

export interface BookingHistoryResponse {
  data: BookingHistory[];
  pagination: BookingHistoryPagination;
}

export interface BookingHistoryQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  status?: BookingStatus;
}



export type BookingHistory = Booking;

export interface BookingTaxLine {
  name: string;
  taxType: string;
  rate: number;
  taxableAmount: number;
  amount: number;
}

export interface BookingAppliedDiscount {
  id?: string;
  code?: string;
  name?: string;
  type?: string;
  value?: number;
  amount?: number;
}

export interface BookingAmountSummary {
  workHours: number;
  workDays: number;
  noOfWorkers: number;

  amount: number;
  serviceFee: number;
  discountAmount: number;

  taxableAmount: number;

  vatRate: number;
  vatAmount: number;

  taxLines: BookingTaxLine[];

  commissionAmount: number;
  workerPoolAmount: number;

  finalAmount: number;

  appliedDiscounts: BookingAppliedDiscount[];
}

export interface BookingHistoryPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}