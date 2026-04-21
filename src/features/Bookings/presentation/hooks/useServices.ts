import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import ServiceRepository from "../../data/repositories/ServiceRepository";
import { GetServicesUseCase } from "../../domain/usecases/services/GetServiceUsecase";
import { GetServiceTierUsecase } from "../../domain/usecases/services/GetServiceTierUsecase";

import type { Service } from "../../domain/entities/service.types";
import type { Category } from "../../domain/entities/category.types";
import type { ServiceTierRef } from "../../domain/entities/servicetier.types";

export const useServices = () => {
  const getServicesUseCase = new GetServicesUseCase(ServiceRepository);
  const getServiceTierUseCase = new GetServiceTierUsecase(ServiceRepository);

 const serviceTiersQuery = useQuery<ServiceTierRef[], Error>({
  queryKey: ["serviceTiers"],
  queryFn: async () => {
    return await getServiceTierUseCase.execute();
  },

  // ✅ FIX
  staleTime: Infinity,
  gcTime: 1000 * 60 * 30,

  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
});

const servicesQuery = useQuery<Service[], Error>({
  queryKey: ["services"],
  queryFn: async () => {
    const response = await getServicesUseCase.execute();
    return Array.isArray(response?.data) ? response.data : [];
  },

  // ✅ FIX
  staleTime: Infinity,
  gcTime: 1000 * 60 * 30,

  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
});

  // ❌ move toast handling outside query (React Query v5 style)
  if (serviceTiersQuery.error) {
    toast.error(serviceTiersQuery.error.message || "Failed to fetch service tiers");
  }

  if (servicesQuery.error) {
    toast.error(servicesQuery.error.message || "Failed to fetch services");
  }

  const categories: Category[] = servicesQuery.data
    ? Object.values(
        servicesQuery.data.reduce((acc, service) => {
          const categoryObj = service.category;

          const categoryId = categoryObj?._id;
          if (!categoryId) return acc;

          if (!acc[categoryId]) {
            acc[categoryId] = {
              _id: categoryId,
              name: categoryObj.name ?? "Category",
              vatRate: categoryObj.vatRate,
              slug: categoryObj.slug ?? "",
              iconUrl: categoryObj.iconUrl,
              iconPublicId: categoryObj.iconPublicId,
              services: [],
            };
          }

          acc[categoryId].services.push(service);

          return acc;
        }, {} as Record<string, Category>)
      )
    : [];

  return {
    categories,
    services: servicesQuery.data ?? [],
    serviceTiers: serviceTiersQuery.data ?? [],
    loading: serviceTiersQuery.isLoading || servicesQuery.isLoading,
    error:
      serviceTiersQuery.error?.message ||
      servicesQuery.error?.message ||
      null,
    refetch: () => {
      serviceTiersQuery.refetch();
      servicesQuery.refetch();
    },
  };
};

export const SERVICES_QUERY_KEY = ["services"] as const;
export const SERVICE_TIERS_QUERY_KEY = ["serviceTiers"] as const;