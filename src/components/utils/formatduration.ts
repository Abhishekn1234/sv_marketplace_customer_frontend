import { Booking } from "@/features/Bookings/domain/entities/booking.types";
import { BookingHistory } from "@/features/Bookings/domain/entities/bookinghistory.types";


type BookingLike = Booking | BookingHistory | any;

export function formatDuration(
  booking: BookingLike,
  t?: any
): string {
  if (!booking) return t?.confirmationpage?.bookingSummary?.na ?? "-";

  const pricingMode = booking.pricingMode;

  const hours =
    booking?.actualValues?.workHours ||
    booking?.estimatedValues?.workHours;

  const days =
    booking?.actualValues?.workDays ||
    booking?.estimatedValues?.workDays;

  if (pricingMode === "HOURLY") {
    if (hours == null) return t?.confirmationpage?.bookingSummary?.na ?? "-";

    if (hours < 1) {
      const mins = Math.round(hours * 60);
      return t
        ? `${mins} ${t.confirmationpage.bookingSummary.minutes}`
        : `${mins} mins`;
    }

    if (hours === 1) {
      return t
        ? `1 ${t.confirmationpage.bookingSummary.hour}`
        : "1 hr";
    }

    return t
      ? `${hours} ${t.confirmationpage.bookingSummary.hours}`
      : `${hours} hrs`;
  }

  if (pricingMode === "PER_DAY") {
    if (days == null) return t?.confirmationpage?.bookingSummary?.na ?? "-";

    if (days === 1) {
      return t
        ? `1 ${t.confirmationpage.bookingSummary.day}`
        : "1 day";
    }

    return t
      ? `${days} ${t.confirmationpage.bookingSummary.days}`
      : `${days} days`;
  }

  return t?.confirmationpage?.bookingSummary?.na ?? "-";
}