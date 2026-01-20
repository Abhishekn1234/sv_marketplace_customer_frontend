import type { ServiceTierRef } from "../entities/servicetier.types";
import type {  Service } from "../entities/service.types";
import type { APIResponse } from "../entities/apiresponse.types";
import type { Category } from "../entities/category.types";

export interface IServiceRepository {
  getServices(): Promise<APIResponse<Category[]>>;
  getServiceTiers(): Promise<ServiceTierRef[]>;
  getServiceById(serviceId: string): Promise<Service | null>;
  getCategories(): Promise<Category[]>;
  searchServices(query: string): Promise<APIResponse<Service[]>>;
}
