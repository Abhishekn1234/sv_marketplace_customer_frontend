
import type { IBookingRepository } from "../../repositories/IBookingRepository";
import type { Booking } from "../../entities/booking.types";
import type { BookingPayload } from "../../entities/bookingpayload.types";
export class CreateBookingUseCase {
  private Bookingrepo:IBookingRepository;
  constructor(bookrepo:IBookingRepository){
    this.Bookingrepo=bookrepo
  }

  async execute(payload: BookingPayload): Promise<Booking> {
    

    if (!payload.serviceId) {
      throw new Error("Service ID is required");
    }

    if (!payload.serviceTierId) {
      throw new Error("Service tier ID is required");
    }

    if (!payload.workDescription || payload.workDescription.trim().length < 5) {
      throw new Error("Work description must be at least 5 characters");
    }

    if (!payload.startDateTime) {
      throw new Error("Start date & time is required");
    }

    const startDate = new Date(payload.startDateTime);
    if (isNaN(startDate.getTime())) {
      throw new Error("Invalid start date & time");
    }

    if (startDate <= new Date()) {
      throw new Error("Booking must be scheduled in the future");
    }

    if (payload.numberOfWorkers < 1) {
      throw new Error("At least one worker is required");
    }

    if (payload.pricingMode === "HOURLY" && payload.estimatedHours <= 0) {
      throw new Error("Estimated hours must be greater than 0");
    }

    if (payload.pricingMode === "PER_DAY" && payload.estimatedDays <= 0) {
      throw new Error("Estimated days must be greater than 0");
    }

    if (
      !payload.location ||
      payload.location.type !== "Point" ||
      payload.location.coordinates.length !== 2
    ) {
      throw new Error("Valid location (lat, lng) is required");
    }

   
    return await this.Bookingrepo.createBooking(payload);
  }
}
