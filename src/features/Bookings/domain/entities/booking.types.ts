import type { ServiceTierRef } from './servicetier.types';
import type { Service } from './service.types';
import type { GeoLocation } from './location.types';
import type { BookingSchedule } from './bookingschedule.types';
import type { BookingStatus } from './bookingstatus.types';

export interface Booking {
  _id: string;
  userId: string;

  // Service reference and populated service object
  serviceId: Service;
  service?: Service;

  // Service tier reference and populated tier object
  serviceTierId?: ServiceTierRef;
  serviceTier?: ServiceTierRef;

  bookingType: "INSTANT" | "SCHEDULED";
  pricingMode: "HOURLY" | "PER_DAY";
  status: BookingStatus;

  // Optional schedule object for SCHEDULED bookings
  schedule?: BookingSchedule;

  // Geolocation info
  location: GeoLocation;

  numberOfWorkers: number;
  workDescription: string;

  currency: string;
  amount: number;
  totalCost?: number;

  // Commission info
  commissionValue: number;
  commissionType: "PERCENTAGE" | "FIXED";
  commissionAmount: number;

  // Worker pool amount
  workerPoolAmount: number;

  // Optional fees and discounts
  serviceFee?: number;
  memberDiscount?: number;

  isFinalized: boolean;

  createdAt: string;
  updatedAt: string;
}



