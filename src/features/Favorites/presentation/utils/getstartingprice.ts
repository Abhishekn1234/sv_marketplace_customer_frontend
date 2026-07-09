import { Service } from "@/features/Bookings/domain/entities/service.types";

export function getStartingPrice(service: Service): number | null {
  if (service.pricingTiers?.length) {
    const prices = service.pricingTiers
      .map((t: any) => t?.price)
      .filter((p: unknown): p is number => typeof p === "number");
    if (prices.length) return Math.min(...prices);
  }
  return typeof service.price === "number" ? service.price : null;
}