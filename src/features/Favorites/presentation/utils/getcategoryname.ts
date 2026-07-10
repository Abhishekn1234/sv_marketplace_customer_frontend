import { Service } from "@/features/Bookings/domain/entities/service.types";

export function getCategoryNames(service: Service): string[] {
  if (!service.category) return [];

  if (Array.isArray(service.category)) {
    return service.category.map((category) => category.name).filter(Boolean);
  }

  return service.category.name ? [service.category.name] : [];
}