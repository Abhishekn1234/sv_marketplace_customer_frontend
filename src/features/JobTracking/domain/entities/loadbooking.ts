import type { Booking } from "@/features/Bookings/domain/entities/booking.types";
import type { Activity } from "./jobtimelineactivities";

export type LocalBooking = Booking & {
  activities: Activity[];
};