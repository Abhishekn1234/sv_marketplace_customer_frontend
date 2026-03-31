import type { Booking } from "../../domain/entities/booking.types";
import type { BookingHistory } from "../../domain/entities/bookinghistory.types";


export function formatBookingDuration(booking: Booking | BookingHistory): string {
  if (!booking.schedule) return "-";

  if (booking.pricingMode === "HOURLY") {
    const hours = booking.schedule.estimatedHours;

    if (hours == null) return "-";
    if (hours < 1) return `${Math.round(hours * 60)} mins`;
    if (hours === 1) return `1 hr`;
    return `${hours} hrs`;
  } else {
    const days = booking.schedule.estimatedDays;

    if (days == null) return "-";
    return days === 1 ? "1 day" : `${days} days`;
  }
}



export function formatBookingDurationWithTranslation(
  data: Booking | BookingHistory,
  t: any 
): string {
  if (!data?.schedule) return t.confirmationpage.bookingSummary.na;

  if (data.pricingMode === "HOURLY") {
    const hours = data.schedule.estimatedHours ?? 0;

    if (hours < 1) {
      const mins = Math.round(hours * 60);
      return `${mins} ${t.confirmationpage.bookingSummary.minutes}`;
    } else if (hours === 1) {
      return `1 ${t.confirmationpage.bookingSummary.hour}`;
    } else {
      return `${hours} ${t.confirmationpage.bookingSummary.hours}`;
    }
  }

  if (data.pricingMode === "PER_DAY") {
    const days = data.schedule.estimatedDays ?? 0;
    if (days === 1) return `1 ${t.confirmationpage.bookingSummary.day}`;
    return `${days} ${t.confirmationpage.bookingSummary.days}`;
  }

  return t.confirmationpage.bookingSummary.na;
}