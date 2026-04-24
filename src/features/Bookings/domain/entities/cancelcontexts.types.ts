import type { Booking } from "./booking.types";

export type CancelContext = {
  previousBookings?: Booking[];
};