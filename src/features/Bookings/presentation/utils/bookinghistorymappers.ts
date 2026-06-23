import type { Booking } from "../../domain/entities/booking.types";
import type { BookingCardDTO } from "../dto/bookinghistorydto";
export function mapBookingToCardDTO(
  booking: Booking
): BookingCardDTO {
  return {
    id: booking._id,
    serviceName: booking.service?.name ?? "Service",
    tierName: booking.serviceTier?.name,
    professionalName: booking.serviceTier?.displayName,
    date: booking.schedule?.startDateTime,
    time: booking.schedule?.estimatedHours,
    price: `${booking.currency} ${booking.amount.toFixed(2)}`,
    status: booking.status,
  };
}
