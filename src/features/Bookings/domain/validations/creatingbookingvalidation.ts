import type { BookingPayload } from "../entities/bookingpayload.types";


function validateFutureDate(dateTime: string): string {
  const date = new Date(dateTime);

  if (!dateTime || isNaN(date.getTime())) {
    throw new Error("Invalid start date & time");
  }

  if (date <= new Date()) {
    throw new Error("Booking must be scheduled in the future");
  }

  return dateTime;
}

function validateLocation(location: BookingPayload["location"]) {
  if (
    !location ||
    location.type !== "Point" ||
    !Array.isArray(location.coordinates) ||
    location.coordinates.length !== 2
  ) {
    throw new Error("Valid location (lat, lng) is required");
  }

  return location;
}



export function validateCreateBooking(
  payload: BookingPayload
): BookingPayload {
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

  validateFutureDate(payload.startDateTime);

  if (!payload.numberOfWorkers || payload.numberOfWorkers < 1) {
    throw new Error("At least one worker is required");
  }

  if (
    payload.pricingMode === "HOURLY" &&
    (!payload.estimatedHours || payload.estimatedHours <= 0)
  ) {
    throw new Error("Estimated hours must be greater than 0");
  }

  if (
    payload.pricingMode === "PER_DAY" &&
    (!payload.estimatedDays || payload.estimatedDays <= 0)
  ) {
    throw new Error("Estimated days must be greater than 0");
  }

  validateLocation(payload.location);

  return payload; 
}
