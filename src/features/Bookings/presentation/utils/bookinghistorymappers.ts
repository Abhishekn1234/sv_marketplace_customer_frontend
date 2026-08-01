import { LocalizedText } from "@/components/common/localizedtext.types";
import type { Booking } from "../../domain/entities/booking.types";
import type { BookingCardDTO } from "../dto/bookinghistorydto";


export function mapBookingToCardDTO(
  booking: Booking,
  localize: (value?: string | LocalizedText) => string
): BookingCardDTO {
  return {
    id: booking._id,

    serviceName: localize(booking.service?.name) || "Service",

    tierName: localize(booking.serviceTier?.name) || "Tier",

    professionalName:
      localize(booking.serviceTier?.displayName) || "Professional",

    date: booking.schedule?.startDateTime,

    time: booking.schedule?.estimatedHours,

    price: `${booking.currency} ${Number(booking.amount ?? 0).toFixed(2)}`,

    status: booking.status,
  };
}
