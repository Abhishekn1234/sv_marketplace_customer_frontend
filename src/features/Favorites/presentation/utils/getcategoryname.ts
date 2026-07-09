import { Service } from "@/features/Bookings/domain/entities/service.types";

export function getCategoryNames(service: Service): string[] {
  return (service.category ?? []).map((c: any) => c?.name).filter(Boolean);
}
