import type { ServiceTierRef } from "../entities/servicetier.types";
import type { Service } from "../entities/service.types";
import type { APIResponse } from "../entities/apiresponse.types";
import type { Category } from "../entities/category.types";

export interface IServiceRepository {
  getServices(
    params?: GetServicesParams
  ): Promise<APIResponse<Service[]>>;

  getServiceTiers(): Promise<ServiceTierRef[]>;

  getServiceById(serviceId: string): Promise<Service | null>;

  getCategories( params?: GetServicesParams): Promise<Category[]>;

  searchServices(
    query: string
  ): Promise<APIResponse<Service[]>>;
}