import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import ServiceRepository from "../../data/repositories/ServiceRepository";
import { GetServicesUseCase } from "../../domain/usecases/services/GetServiceUsecase";
import { GetServiceTierUsecase } from "../../domain/usecases/services/GetServiceTierUsecase";

import type { Service } from "../../domain/entities/service.types";
import type { Category } from "../../domain/entities/category.types";
import type { ServiceTierRef } from "../../domain/entities/servicetier.types";
import { GetServicesParams } from "../../domain/entities/bookingservices.params.types";



export const useServices = ({
  page = 1,
  limit = 10,
  sort = "createdAt:desc",
  search = "",
  categoryId,
  language = "en",
}: GetServicesParams = {}) => {
  const getServicesUseCase = new GetServicesUseCase(ServiceRepository);
  const getServiceTierUseCase = new GetServiceTierUsecase(ServiceRepository);

  const serviceTiersQuery = useQuery<ServiceTierRef[], Error>({
    queryKey: ["serviceTiers"],
    queryFn: () => getServiceTierUseCase.execute(),

    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const servicesQuery = useQuery<Service[], Error>({
    queryKey: [
      "services",
      page,
      limit,
      sort,
      search,
      categoryId,
      language,
    ],

    queryFn: async () => {
          const response = await getServicesUseCase.execute({
        page,
        limit,
        sort,
        search,
        categoryId,
       language,
      });
      return Array.isArray(response?.data) ? response.data : [];
    },

    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (serviceTiersQuery.error) {
    toast.error(
      serviceTiersQuery.error.message ||
        "Failed to fetch service tiers"
    );
  }

  if (servicesQuery.error) {
    toast.error(
      servicesQuery.error.message ||
        "Failed to fetch services"
    );
  }

  const categories: Category[] = servicesQuery.data
    ? Object.values(
        servicesQuery.data.reduce((acc, service) => {
          const category = service.category;

          if (!category?._id) return acc;

          if (!acc[category._id]) {
            acc[category._id] = {
              _id: category._id,
              name: category.name,
              slug: category.slug,
              vatRate: category.vatRate,
              iconUrl: category.iconUrl,
              iconPublicId: category.iconPublicId,
              services: [],
            };
          }

          acc[category._id].services.push(service);

          return acc;
        }, {} as Record<string, Category>)
      )
    : [];

  return {
    categories,
    services: servicesQuery.data ?? [],
    serviceTiers: serviceTiersQuery.data ?? [],
    loading:
      servicesQuery.isLoading || serviceTiersQuery.isLoading,
    error:
      servicesQuery.error?.message ||
      serviceTiersQuery.error?.message ||
      null,
    refetch: () => {
      servicesQuery.refetch();
      serviceTiersQuery.refetch();
    },
  };
};

export const SERVICES_QUERY_KEY = ["services"] as const;
export const SERVICE_TIERS_QUERY_KEY = ["serviceTiers"] as const;