import { useQuery } from "@tanstack/react-query";


import ServiceRepository from "../../data/repositories/ServiceRepository";
import { GetServiceCategoriesUseCase } from "../../domain/usecases/services/GetServiceCategoryUsecase";

import type { Category } from "../../domain/entities/category.types";

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
