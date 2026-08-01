import { LocalizedText } from "@/components/common/localizedtext.types";
import { Service } from "@/features/Bookings/domain/entities/service.types";

export function getCategoryNames(
  service: Service,
  localize: (text?: string | LocalizedText) => string
): string[] {
  if (!service.category) return [];

  return [localize(service.category.name)];
}