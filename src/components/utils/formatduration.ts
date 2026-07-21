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

  const totalSeconds = Math.round(hours * 3600);

  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const parts: string[] = [];

  if (hrs > 0) {
    parts.push(
      t
        ? `${hrs} ${hrs === 1 ? t.confirmationpage.bookingSummary.hour : t.confirmationpage.bookingSummary.hours}`
        : `${hrs} ${hrs === 1 ? "hr" : "hrs"}`
    );
  }

  if (mins > 0) {
    parts.push(
      t
        ? `${mins} ${mins === 1 ? t.confirmationpage.bookingSummary.minute : t.confirmationpage.bookingSummary.minutes}`
        : `${mins} min`
    );
  }

  if (secs > 0 || parts.length === 0) {
    parts.push(
      t
        ? `${secs} ${secs === 1 ? t.confirmationpage.bookingSummary.second : t.confirmationpage.bookingSummary.seconds}`
        : `${secs} sec`
    );
  }

  return parts.join(" ");
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