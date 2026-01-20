import type { ServiceTierRef } from './servicetier.types';
import type { Service, } from './service.types';
import type { GeoLocation } from './location.types';
import type { BookingSchedule } from './bookingschedule.types';
export interface Booking {
  _id: string;
  userId: string;
  
  serviceId: string;           
  service?: Service;        

  serviceTierId?: string;      
  serviceTier?: ServiceTierRef;

  bookingType: "INSTANT" | "SCHEDULED";
  pricingMode: "HOURLY" | "PER_DAY";
  status: "REQUESTED" | "ACTIVE" | "COMPLETED" | "CANCELLED";

  schedule?: BookingSchedule;
  location: GeoLocation;

  numberOfWorkers: number;
  workDescription: string;


  currency: string;
  amount: number;
  commissionValue: number;
  commissionType: "PERCENTAGE" | "FIXED";
  commissionAmount: number;
  workerPoolAmount: number;

  isFinalized: boolean;

  createdAt: string;
  updatedAt: string;
}


