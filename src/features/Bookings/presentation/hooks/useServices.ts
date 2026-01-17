import { useQuery,  type UseQueryOptions } from "@tanstack/react-query";
import { toast } from "react-toastify";

import ServiceRepository from "../../data/repositories/ServiceRepository";
import { GetServicesUseCase } from "../../domain/usecases/services/GetServiceUsecase";
import { GetServiceTierUsecase } from "../../domain/usecases/services/GetServiceTierUsecase";

import type { Category, Service } from "../../domain/entities/service.types";
import type { ServiceTierRef } from "../../domain/entities/booking.types";

export const useServices = () => {
  // const queryClient = useQueryClient();

  const getServicesUseCase = new GetServicesUseCase(ServiceRepository);
  const getServiceTierUseCase = new GetServiceTierUsecase(ServiceRepository);

  // ------------------------------
  // Service Tiers Query
  // ------------------------------
  const serviceTiersQuery = useQuery<ServiceTierRef[], Error>({
    queryKey: ["serviceTiers"],
    queryFn: async () => {
      const tiers = await getServiceTierUseCase.execute();
      return tiers;
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to fetch service tiers";
      toast.error(message);
    },
  } as UseQueryOptions<ServiceTierRef[], Error>); // ✅ cast to UseQueryOptions

  // ------------------------------
  // Services Query
  // ------------------------------
  const servicesQuery = useQuery<Service[], Error>({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await getServicesUseCase.execute();
      if (!Array.isArray(response)) return [];
      return response;
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to fetch services";
      toast.error(message);
    },
  } as UseQueryOptions<Service[], Error>); // ✅ cast to UseQueryOptions

  // ------------------------------
  // Derived Categories
  // ------------------------------
  const categories: Category[] = servicesQuery.data
    ? Object.values(
        servicesQuery.data.reduce((acc, service) => {
          const categoryObj =
            typeof service.category === "string" ? null : service.category;

          const categoryId =
            typeof service.category === "string"
              ? service.category
              : service.category._id;

          if (!acc[categoryId]) {
            acc[categoryId] = {
              _id: categoryId,
              name: categoryObj?.name ?? "Category",
              slug: categoryObj?.slug ?? "",
              iconUrl: categoryObj?.iconUrl,
              iconPublicId: categoryObj?.iconPublicId,
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
    error: serviceTiersQuery.error?.message || servicesQuery.error?.message || null,
    refetch: () => {
      serviceTiersQuery.refetch();
      servicesQuery.refetch();
    },
  };
};

export const SERVICES_QUERY_KEY = ['services'] as const;
export const SERVICE_TIERS_QUERY_KEY = ['serviceTiers'] as const;