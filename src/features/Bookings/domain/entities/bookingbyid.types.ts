import type { ServiceTierDetails } from "./pricingtier.types";

export interface BookingById {
  _id: string;

  amount: number;
  totalCost: number;

  currency: string;

  bookingType: "SCHEDULED" | "INSTANT";

  pricingMode: "HOURLY" | "PER_DAY";

  status:
    | "REQUESTED"
    | "CONFIRMED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";

  commissionAmount: number;
  commissionType: "PERCENTAGE" | "FLAT";
  commissionValue: number;

  memberDiscount: number;
  serviceFee: number;

  numberOfWorkers: number;
  workerPoolAmount: number;

  isFinalized: boolean;

  workDescription?: string;

  createdAt: string;
  updatedAt: string;

  // 🔹 Schedule
  schedule?: {
    startDateTime: string;
    estimatedHours: number;
  };
   estimatedDays?:string;
  // 🔹 Location (GeoJSON)
  location: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };

 
  serviceId: {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    category?: {
      _id: string;
      name: string;
      slug?: string;
      iconUrl?: string;
    };
  };

  // 🔹 Populated Tier
  serviceTierId: ServiceTierDetails;

  // 🔹 Populated User
  userId: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    kycStatus: string;
    profilePictureUrl?: string;
  };
}
