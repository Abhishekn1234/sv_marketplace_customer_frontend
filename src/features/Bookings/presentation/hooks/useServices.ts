import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import ServiceRepository from "../../data/repositories/ServiceRepository";
import { GetServicesUseCase } from "../../domain/usecases/services/GetServiceUsecase";
import { GetServiceTierUsecase } from "../../domain/usecases/services/GetServiceTierUsecase";

import type { Category,PricingTier,Service } from "../../domain/entities/service.types";
import type { ServiceTierRef } from "../../domain/entities/booking.types";
const mapPricingTierToServiceTierRef = (
  tier: PricingTier
): ServiceTierRef => ({
  _id: tier._id,
  name: tier.tier?.displayName,
  code: tier.tier?.code,
  displayName: tier.tier?.displayName,
  description: tier.tier?.description ?? "",
  isActive: true, // or tier.isActive if backend provides it
  createdAt: undefined,
  updatedAt: undefined,
});

export const useServices = () => {
  /* ------------------------------------------------------------------ */
  /* STATE */
  /* ------------------------------------------------------------------ */

  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceTiers, setServiceTiers] = useState<ServiceTierRef[]>([]);

  const [servicesLoading, setServicesLoading] = useState(false);
  const [tiersLoading, setTiersLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* ------------------------------------------------------------------ */
  /* USE CASES */
  /* ------------------------------------------------------------------ */



  const getServicesUseCase = new GetServicesUseCase(ServiceRepository);
  const getServiceTierUseCase = new GetServiceTierUsecase(ServiceRepository);

  /* ------------------------------------------------------------------ */
  /* FETCH SERVICES */
  /* ------------------------------------------------------------------ */

  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      setError(null);

      const response = await getServicesUseCase.execute();

      if (!Array.isArray(response)) {
        setCategories([]);
        setServices([]);
        return;
      }

      // Filter valid categories
      const validCategories: Category[] = response.filter(
        (item): item is Category => Array.isArray(item.services)
      );

      setCategories(validCategories);

      // Flatten services
      const allServices: Service[] = validCategories.flatMap(
        (category) => category.services
      );

      setServices(allServices);
    } catch (err: any) {
      const message = err?.message || "Failed to fetch services";
      setError(message);
      toast.error(message);
    } finally {
      setServicesLoading(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* FETCH SERVICE TIERS */
  /* ------------------------------------------------------------------ */

  const fetchServiceTiers = async () => {
  try {
    setTiersLoading(true);
    setError(null);

    const response = await getServiceTierUseCase.execute();

    const mappedTiers: ServiceTierRef[] = response.map(
      mapPricingTierToServiceTierRef
    );

    setServiceTiers(mappedTiers);
  } catch (err: any) {
    const message = err?.message || "Failed to fetch service tiers";
    setError(message);
    toast.error(message);
  } finally {
    setTiersLoading(false);
  }
};


  /* ------------------------------------------------------------------ */
  /* EFFECT */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    fetchServices();
    fetchServiceTiers();
  }, []);

  /* ------------------------------------------------------------------ */
  /* RETURN */
  /* ------------------------------------------------------------------ */

  return {
    categories,
    services,
    serviceTiers,
    loading: servicesLoading || tiersLoading,
    error,
    refetch: () => {
      fetchServices();
      fetchServiceTiers();
    },
  };
};
