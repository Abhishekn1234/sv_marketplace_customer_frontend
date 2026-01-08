import type { IServiceRepository } from "../../repositories/IServiceRepository";
import type { PricingTier } from "../../entities/service.types";

export class GetServiceTierUsecase {
 private serviceRepo:IServiceRepository;
 constructor(service:IServiceRepository){
  this.serviceRepo=service;
 }

  async execute(): Promise<PricingTier[]> {
    const response = await this.serviceRepo.getServiceTiers();

    // Defensive fallback
    if (!response || !Array.isArray(response.data)) {
      return [];
    }

    return response.data;
  }
}
