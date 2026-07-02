import { useMemo } from "react";
import type { Category } from "@/features/Bookings/domain/entities/category.types";

export function useCategoryCardMetrics(category: Category) {
  return useMemo(() => {
    const services = category.services ?? [];

    const averageRating =
      services.length > 0
        ? (
            services.reduce((sum, service) => sum + (service.avgRating ?? 0), 0) /
            services.length
          ).toFixed(1)
        : "0";

    let totalPrice = 0;
    let priceCount = 0;

    services.forEach((service) => {
      const pricing = service.pricingTiers?.[0];

      if (pricing?.HOURLY?.ratePerHour) {
        totalPrice += pricing.HOURLY.ratePerHour;
        priceCount += 1;
      } else if (pricing?.PER_DAY?.ratePerDay) {
        totalPrice += pricing.PER_DAY.ratePerDay;
        priceCount += 1;
      }
    });

    const averagePrice =
      priceCount > 0
        ? `${services[0]?.currency || "SAR"} ${(totalPrice / priceCount).toFixed(0)}`
        : null;

    return {
      averagePrice,
      averageRating,
      serviceCount: services.length,
    };
  }, [category]);
}
