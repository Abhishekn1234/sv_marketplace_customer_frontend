import type { ServiceTierRef } from "../entities/booking.types";
import type { APIResponse, Category, PricingTier, Service } from "../entities/service.types";

export interface IServiceRepository {
  getServices(): Promise<APIResponse<Category[]>>;
  getServiceTiers(): Promise<ServiceTierRef[]>;
  getServiceById(serviceId: string): Promise<Service | null>;
  getCategories(): Promise<Category[]>;
  searchServices(query: string): Promise<APIResponse<Service[]>>;
}
