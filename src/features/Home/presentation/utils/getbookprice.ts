import type { Booking } from "@/features/Bookings/domain/entities/booking.types";

export const getBookingPrice = (booking: Booking) => {
  const service =
    typeof booking.serviceId === "object"
      ? booking.serviceId
      : booking.service;

  const pricingTiers = service?.pricingTiers;
  const selectedTierId =
    typeof booking.serviceTierId === "object"
      ? booking.serviceTierId._id
      : booking.serviceTierId ?? booking.serviceTier?._id;

  if (!pricingTiers || !selectedTierId) return booking.estimatedValues?.amount;

  const matchedTier = pricingTiers.find(
    (tier) => tier._id === selectedTierId
  );

  if (!matchedTier) return booking.estimatedValues?.amount;

  if (booking.pricingMode === "HOURLY") {
    return matchedTier.HOURLY?.ratePerHour ?? booking.estimatedValues?.finalAmount;
  }

  if (booking.pricingMode === "PER_DAY") {
    return matchedTier.PER_DAY?.ratePerDay ?? booking.estimatedValues?.finalAmount;
  }

  return booking.estimatedValues?.finalAmount;
};