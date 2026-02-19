import { useQuery } from "@tanstack/react-query";
import type { Category } from "../../domain/entities/category.types";

import ServiceRepository from "../../data/repositories/ServiceRepository";
import { GetServiceCategoriesUseCase } from "../../domain/usecases/services/GetServiceCategoryUsecase";

const getServiceCategoriesUseCase = new GetServiceCategoriesUseCase(
  ServiceRepository
);

export const useServiceCategory = () => {
  return useQuery<Category[], Error>({
    queryKey: ["service-categories"],
    queryFn: () => getServiceCategoriesUseCase.execute(),
    staleTime: 5 * 60 * 1000,
  });
};
