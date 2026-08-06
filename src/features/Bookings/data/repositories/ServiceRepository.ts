import type { IServiceRepository } from "../../domain/repositories/IServiceRepository";
import type { Service } from "../../domain/entities/service.types";
import type { APIResponse } from "../../domain/entities/apiresponse.types";
import type { Category } from "../../domain/entities/category.types";
import type { GetBookingsResponse } from "../../domain/entities/getbookingresponse.types";
import type { ServiceTierRef } from "../../domain/entities/servicetier.types";
import type { GetServicesParams } from "../../domain/entities/bookingservices.params.types";

import apiClient from "../../../api/interceptor";
import { useAuthStore } from "@/features/core/store/auth";

export class ServiceRepository implements IServiceRepository {
  private readonly baseUrl = "booking";

 async getServices(
  params: GetServicesParams = {}
): Promise<APIResponse<Service[]>> {
  const { language: _language, ...queryParams } = params;
  const selectedLanguage = useAuthStore.getState().language;

  const response = await apiClient.get<APIResponse<Service[]>>(
    `${this.baseUrl}/services`,
    {
      params: queryParams,
      headers: {
        ...(selectedLanguage ? { "accept-language": selectedLanguage } : {}),
      },
    }
  );

  return response.data;
}

  async getBookings(): Promise<GetBookingsResponse> {
    const response = await apiClient.get<GetBookingsResponse>(
      "/booking"
    );

    return response.data;
  }

  async getServiceTiers(): Promise<ServiceTierRef[]> {
    const selectedLanguage = useAuthStore.getState().language;
    const response = await apiClient.get<ServiceTierRef[]>(
      `${this.baseUrl}/pricing-tiers`,
      {
        headers: {
          ...(selectedLanguage ? { "accept-language": selectedLanguage } : {}),
        },
      }
    );

    return response.data;
  }

  async getServiceById(
    serviceId: string
  ): Promise<Service | null> {
    const response = await apiClient.get<Service>(
      `${this.baseUrl}/${serviceId}`
    );

    return response.data;
  }

  async getCategories( params?: GetServicesParams): Promise<Category[]> {
    const selectedLanguage = useAuthStore.getState().language;
    const response = await apiClient.get<APIResponse<Category[]>>(
      "/services",
      {
        headers: {
          ...(selectedLanguage ? { "accept-language": selectedLanguage } : {}),
        },
      }
    );

    return response.data.data;
  }

  async searchServices(
    query: string
  ): Promise<APIResponse<Service[]>> {
    const selectedLanguage = useAuthStore.getState().language;
    const response = await apiClient.get<APIResponse<Service[]>>(
      `${this.baseUrl}/services`,
      {
        params: {
          search: query,
        },
        headers: {
          ...(selectedLanguage ? { "accept-language": selectedLanguage } : {}),
        },
      }
    );

    return response.data;
  }
}

export default new ServiceRepository();