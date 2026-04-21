
import type { IServiceRepository } from "../../domain/repositories/IServiceRepository";
import type {
  

  Service,
} from "../../domain/entities/service.types";
import type { APIResponse } from "../../domain/entities/apiresponse.types";
import type { Category } from "../../domain/entities/category.types";
import apiClient from "../../../api/interceptor";
import type { GetBookingsResponse } from "../../domain/entities/getbookingresponse.types";
import type { ServiceTierRef } from "../../domain/entities/servicetier.types";
import type { GetServicesParams } from "../../domain/entities/bookingservices.params.types";
export class ServiceRepository implements IServiceRepository {
 private readonly baseUrl = "booking"; 


  async getServices(params: GetServicesParams = {}): Promise<APIResponse<Service[]>> {
    const queryParams = new URLSearchParams();

    if (params.page !== undefined) queryParams.append("page", params.page.toString());
    if (params.limit !== undefined) queryParams.append("limit", params.limit.toString());
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.search) queryParams.append("search", params.search);
    if (params.categoryId) queryParams.append("categoryId", params.categoryId);

    const url = `${this.baseUrl}/services?${queryParams.toString()}`;

    const response = await apiClient.get<APIResponse<Service[]>>(url);

    console.log("Full Axios Response:", response);
    console.log("Actual API Data:", response.data);

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
  const response = await apiClient.get<APIResponse<Category[]>>("/services");

  console.log("Full API response:", response);
  console.log("Categories array:", response.data.data);

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
