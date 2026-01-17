export interface AuthBooking {
  _id: string;

  serviceName: string;
  bookingType: "INSTANT" | "SCHEDULED";

  amount: number;
  currency: string;

  status: "REQUESTED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  numberOfWorkers: number;

  tierName?: string;
  locationName?: string;

  workDescription: string;

  createdAt: string;
  updatedAt: string;
}