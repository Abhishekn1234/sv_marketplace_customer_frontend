import { Service } from "@/features/Bookings/domain/entities/service.types";

export function getStartingPrice(service: Service): number | null {
  if (!service.pricingTiers?.length) {
    return null;
  }

  const prices = service.pricingTiers.flatMap((tier) => {
    const values: number[] = [];

    if (tier.HOURLY?.ratePerHour) {
      values.push(tier.HOURLY.ratePerHour);
    }

    if (tier.PER_DAY?.ratePerDay) {
      values.push(tier.PER_DAY.ratePerDay);
    }

    return values;
  });

  return prices.length ? Math.min(...prices) : null;
}