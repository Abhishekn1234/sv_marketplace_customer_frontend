import type { ServiceTierRef } from "./servicetier.types";
import type { Service } from "./service.types";
import type { BookingSchedule } from "./bookingschedule.types";
import type { BookingStatus } from "./bookingstatus.types";
import type { AssignedWorker } from "./assignedworkers.type";
import type { Geopoint } from "./geopoint.types";
import type { GenerateInvoice } from "@/features/Generateotp/domain/entities/generateinvoice";
import type {
  BookingDetails,
  TaxLine,
  BookingValueBreakdown,
} from "./bookingpricedetails";
import type { User } from "@/features/Auth/domain/entities/auth.types";
import type { Activity } from "@/features/JobTracking/domain/entities/jobtimelineactivities";


export interface Booking {
  _id: string;
  bookingCode?: string;

  // References (can be populated or plain ids)
  userId: string | User;
  serviceId?: string | Service;
  serviceTierId?: string | ServiceTierRef;

  // Populated objects
  customer?: User;
  service?: Service;
  serviceTier?: ServiceTierRef;

  invoiceId?: string;
  invoice?: GenerateInvoice;

  bookingDetails?: BookingDetails;

  bookingType: "INSTANT" | "SCHEDULED";
  pricingMode: "HOURLY" | "PER_DAY";
  status: BookingStatus;

  schedule?: BookingSchedule;

  location: Geopoint;

  numberOfWorkers: number;
  workDescription: string;

  currency: string;

  // Estimated Pricing
  amount: number;
  serviceFee?: number;
  discountAmount?: number;
  taxableAmount?: number;
  totalCost?: number;

  vatRate?: number;
  vatAmount?: number;

  commissionValue: number;
  commissionType: "PERCENTAGE" | "FIXED";
  commissionAmount: number;

  workerPoolAmount: number;

  memberDiscount?: number;

  taxLines?: TaxLine[];
  appliedDiscounts?: any[];

  estimatedValues?: BookingValueBreakdown;
  actualValues?: BookingValueBreakdown;

  // Final calculated values
  finalAmount?: number;
  finalWorkerPoolAmount?: number;

  // Actual work
  actualWorkDays?: number;
  actualWorkHours?: number;
  actualWorkMinutes?: number;

  isFinalized: boolean;

  startedAt?: string;
  completedAt?: string;

  paymentId?: string;
  transactionId?: string;
  sessionId?: string;

  assignedWorkers?: AssignedWorker[];

  payments?: any[];
  disputes?: any[];

  activities?: Activity[];

  createdAt: string;
  updatedAt: string;
}