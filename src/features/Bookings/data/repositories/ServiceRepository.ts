// src/repositories/implementation/ServiceRepository.ts
import type { IServiceRepository } from "../../domain/repositories/IServiceRepository";
import type {
  APIResponse,
  Category,
  PricingTier,
  Service,
} from "../../domain/entities/service.types";
import apiClient from "../../../api/interceptor";

export class ServiceRepository implements IServiceRepository {
  private readonly baseUrl = "/booking";

  async getServices(): Promise<APIResponse<Category[]>> {
    const response = await apiClient.get<APIResponse<Category[]>>(
      `${this.baseUrl}/services`
    );
    return response.data;
  }

  async getServiceTiers(): Promise<APIResponse<PricingTier[]>> {
    const response = await apiClient.get<APIResponse<PricingTier[]>>(
      `${this.baseUrl}/pricing-tiers`
    );
    return response.data;
  }

  async getServiceById(serviceId: string): Promise<Service | null> {
    const response = await apiClient.get<Service>(
      `${this.baseUrl}/${serviceId}`
    );
    return response.data;
  }

  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<APIResponse<Category[]>>(
      `${this.baseUrl}/categories`
    );
    return response.data.data;
  }

  async searchServices(query: string): Promise<APIResponse<Service[]>> {
    const response = await apiClient.get<APIResponse<Service[]>>(
      `${this.baseUrl}?search=${query}`
    );
    return response.data;
  }
}

export default new ServiceRepository();
