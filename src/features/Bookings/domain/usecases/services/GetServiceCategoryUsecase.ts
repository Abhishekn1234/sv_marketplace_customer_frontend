

import type { Category } from "../../entities/category.types";

import type { IServiceRepository } from "../../repositories/IServiceRepository";

export class GetServiceCategoriesUseCase {
  private readonly serviceRepository: IServiceRepository;

  constructor(serviceRepository: IServiceRepository) {
    this.serviceRepository = serviceRepository;
  }

   async execute(): Promise<Category[]> {
    return this.serviceRepository.getCategories();
  }
}

