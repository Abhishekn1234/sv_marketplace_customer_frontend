

import type { Booking } from "../../Bookings/domain/entities/booking.types";
import type { AuthBooking } from "../../Bookings/domain/entities/auth.booking.types";

export const mapBookingToAuthBooking = (
  booking: Booking,
  serviceName?: string,
  tierName?: string,
  locationName?: string
): AuthBooking => ({
  _id: booking._id,

  serviceName: serviceName ?? "Unknown Service",
  bookingType: booking.bookingType,

  amount: booking.amount,
  currency: booking.currency,

  status: booking.status,
  numberOfWorkers: booking.numberOfWorkers,

  tierName,
  locationName,

  workDescription: booking.workDescription,

  createdAt: booking.createdAt,
  updatedAt: booking.updatedAt,
});
