import type { Service } from "@/features/Bookings/domain/entities/service.types";

export function getCategoryNames(service: Service): string[] {
  return service.categories ? [service.categories?.name] : [];
}