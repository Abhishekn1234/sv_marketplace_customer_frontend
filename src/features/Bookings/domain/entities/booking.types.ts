import type { ServiceTierRef } from "./servicetier.types";
import type { Service } from "./service.types";

import type { BookingSchedule } from "./bookingschedule.types";
import type { BookingStatus } from "./bookingstatus.types";
import type { AssignedWorker } from "./assignedworkers.type";
import type { Geopoint } from "./geopoint.types";

export interface Booking {
  _id: string;
  bookingCode?: string;
  userId: string;

  // ✅ Backend sends FULL object here
  serviceId: Service;

  // ✅ Optional normalized field (frontend convenience)
  service?: Service;

  // ✅ Backend sends FULL object here
  serviceTierId?: ServiceTierRef;

  // ✅ Optional normalized field
  serviceTier?: ServiceTierRef;

  bookingType: "INSTANT" | "SCHEDULED";
  pricingMode: "HOURLY" | "PER_DAY";
  status: BookingStatus;

  schedule?: BookingSchedule;

  location: Geopoint;

  numberOfWorkers: number;
  workDescription: string;

  currency: string;
  amount: number;
  totalCost?: number;

  // ✅ TAX (missing earlier)
  vatRate?: number;
  vatAmount?: number;

  // ✅ Commission
  commissionValue: number;
  commissionType: "PERCENTAGE" | "FIXED";
  commissionAmount: number;

  workerPoolAmount: number;

  serviceFee?: number;
  memberDiscount?: number;

  isFinalized: boolean;

  // ✅ Timeline fields (IMPORTANT for your UI)
  startedAt?: string;
  completedAt?: string;

  // ✅ Payment (IMPORTANT for verify flow)
  paymentId: string;
  transactionId?: string;

  assignedWorkers?: AssignedWorker[];

  createdAt: string;
  updatedAt: string;
  activities?: {
  [key: string]: any;
  type: string;
  createdAt: string;
}[];
}
