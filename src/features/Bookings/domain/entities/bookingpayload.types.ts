export interface BookingPayload {
  workDescription: string;
  serviceId: string;
  
  totalCost?:string| number;
  serviceTierId: string[] | string;
  pricingMode: "HOURLY" | "PER_DAY";
  numberOfWorkers: number;
  bookingType: "INSTANT" | "SCHEDULED";
  startDateTime: string;
  estimatedHours: number;
  estimatedDays: number;
  location: {
    type?: "Point";
    coordinates: [number, number] | string;
  };
}
