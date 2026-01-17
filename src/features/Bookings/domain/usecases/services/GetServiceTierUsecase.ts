import type { IServiceRepository } from "../../repositories/IServiceRepository";
import type { ServiceTierRef } from "../../entities/booking.types";
import type { APIResponse } from "../../entities/service.types";

export class GetServiceTierUsecase {
  private serviceRepo: IServiceRepository;

  constructor(service: IServiceRepository) {
    this.serviceRepo = service;
  }

  async execute(): Promise<ServiceTierRef[]> {
    const response = await this.serviceRepo.getServiceTiers();
    
    // ✅ Unwrap the array from APIResponse
    return response || [];
  }
}





