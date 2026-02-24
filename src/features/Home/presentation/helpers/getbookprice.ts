import type { Booking } from "@/features/Bookings/domain/entities/booking.types";

export const getBookingPrice = (booking: Booking) => {
  const pricingTiers = booking.serviceId?.pricingTiers;
  const selectedTierId = booking.serviceTierId?._id;

  if (!pricingTiers || !selectedTierId) return booking.amount;

  const matchedTier = pricingTiers.find(
    (tier) => tier._id === selectedTierId
  );

  if (!matchedTier) return booking.amount;

  if (booking.pricingMode === "HOURLY") {
    return matchedTier.HOURLY?.ratePerHour ?? booking.amount;
  }

  if (booking.pricingMode === "PER_DAY") {
    return matchedTier.PER_DAY?.ratePerDay ?? booking.amount;
  }

  return booking.amount;
};