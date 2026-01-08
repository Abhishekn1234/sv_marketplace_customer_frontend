// src/types/booking.types.ts
export interface ServiceTierRef {
  _id: string;
  name?: string;
  code?:string;
  displayName?:string;
  description:string;
  isActive:boolean;
  createdAt?:Date;
  updatedAt?:Date;

}

    
export interface BookingPayload {
  workDescription: string;
  serviceId: string;
  
  totalCost?:string;
  serviceTierId: string;
  pricingMode: "HOURLY" | "PER_DAY";
  numberOfWorkers: number;
  bookingType: "INSTANT" | "SCHEDULED";
  startDateTime: string;
  estimatedHours: number;
  estimatedDays: number;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
}
export interface ServiceRef {
  _id: string;
  name: string;
}

export interface Booking {
  _id: string;
  userId: string;
  
  serviceId: string;           // Always present
  service?: ServiceRef;        // Optional, populated if available

  serviceTierId?: string;      // Added: string id of tier
  serviceTier?: ServiceTierRef; // Optional, may be populated

  bookingType: "INSTANT" | "SCHEDULED";
  pricingMode: "HOURLY" | "PER_DAY";
  status: "REQUESTED" | "ACTIVE" | "COMPLETED" | "CANCELLED";

  schedule?: BookingSchedule;
  location: GeoLocation;

  numberOfWorkers: number;
  workDescription: string;

  // Pricing & commission
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


export interface GetBookingsRequest {
  userId: string;
}

export interface GetBookingsResponse {
  bookings: Booking[];
}

export interface CancelBookingRequest {
  bookingId: string;
}
export interface GeoLocation {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
}

export interface BookingSchedule {
  startDateTime: string; // ISO string
  estimatedDays: number;
}

export interface CancelBookingResponse {
  success: boolean;
}

