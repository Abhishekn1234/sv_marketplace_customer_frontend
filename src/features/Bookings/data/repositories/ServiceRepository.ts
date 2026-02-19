
import type { IServiceRepository } from "../../domain/repositories/IServiceRepository";
import type {
  

  Service,
} from "../../domain/entities/service.types";
import type { APIResponse } from "../../domain/entities/apiresponse.types";
import type { Category } from "../../domain/entities/category.types";
import apiClient from "../../../api/interceptor";
import type { GetBookingsResponse } from "../../domain/entities/getbookingresponse.types";
import type { ServiceTierRef } from "../../domain/entities/servicetier.types";
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
    const response = await apiClient.get<Category[]>(
      `${this.baseUrl}/categories`
    );

    console.log("Full API response:", response.data); // full object
    console.log("Categories array:", response.data); // just the array

    return response.data; // ✅ return full APIResponse
  }
  async searchServices(query: string): Promise<APIResponse<Service[]>> {
    const response = await apiClient.get<APIResponse<Service[]>>(
      `${this.baseUrl}?search=${query}`
    );
    return response.data;
  }
}

export default new ServiceRepository();
