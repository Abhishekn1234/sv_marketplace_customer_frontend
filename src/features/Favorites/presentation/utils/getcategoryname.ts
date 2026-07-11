import { Service } from "@/features/Bookings/domain/entities/service.types";

export function getCategoryNames(service: Service): string[] {
  if (!service.category) return [];

  return [service.category.name];
}