import type { BookingStatus } from "./bookingstatus.types";

export interface AuthBooking {
  _id: string;

  serviceName: string;
  bookingType: "INSTANT" | "SCHEDULED";

  amount: number;
  currency: string;

  status: BookingStatus;
  numberOfWorkers: number;

  tierName?: string;
  locationName?: string;

  workDescription: string;

  createdAt: string;
  updatedAt: string;
}