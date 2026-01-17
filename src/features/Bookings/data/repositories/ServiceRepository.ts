// src/repositories/implementation/ServiceRepository.ts
import type { IServiceRepository } from "../../domain/repositories/IServiceRepository";
import type {
  APIResponse,
  Category,
  PricingTier,
  Service,
} from "../../domain/entities/service.types";
import apiClient from "../../../api/interceptor";
import type { GetBookingsResponse, ServiceTierRef } from "../../domain/entities/booking.types";

export class ServiceRepository implements IServiceRepository {
 private readonly baseUrl = "booking"; // remove leading slash


  async getServices(): Promise<APIResponse<Category[]>> {
    const response = await apiClient.get<APIResponse<Category[]>>(
      `${this.baseUrl}/services`
    );
    return response.data;
  }
  async getBookings(): Promise<GetBookingsResponse> {
  const response = await apiClient.get<GetBookingsResponse>(`/booking`);
  console.log("Single booking object:", response.data);
  
  
  return   response.data ;
}

  async getServiceTiers(): Promise<ServiceTierRef[]> {
    const response = await apiClient.get<ServiceTierRef[]>(
      `${this.baseUrl}/pricing-tiers`
    );
    console.log(response);
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
