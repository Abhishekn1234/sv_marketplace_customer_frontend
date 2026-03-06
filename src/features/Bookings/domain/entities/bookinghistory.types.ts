import type { BookingSchedule } from "./bookingschedule.types";
import type { BookingStatus } from "./bookingstatus.types";
import type { Service } from "./service.types";
import type { ServiceTierRef } from "./servicetier.types";

export interface BookingHistoryResponse{
  data:BookingHistory[];
  pagination:BookingHistoryPagination

}
export interface BookingHistoryQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  status?: BookingStatus;
}
export interface BookingHistory {
  _id: string;
  userId: string;
  serviceId: string;
  serviceTierId: string;

  bookingType: "SCHEDULED" | "INSTANT";
  status: string;

  pricingMode: "HOURLY" | "PER_DAY";
  currency: string;
  amount: number;

  commissionValue: number;
  commissionType: string;
  commissionAmount: number;

  numberOfWorkers: number;
  workerPoolAmount: number;

  workDescription: string;

  isFinalized: boolean;
  memberDiscount: number;
  serviceFee: number;

  location: Location;

  schedule?: BookingSchedule;

  startedAt?: string;
  completedAt?: string;

  actualWorkDays?: number;
  actualWorkHours?: number;

  invoiceId?: string;

  service: Service;
  serviceTier: ServiceTierRef;

  createdAt: string;
  updatedAt: string;
}

export interface BookingHistoryPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}