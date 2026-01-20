import type { IServiceRepository } from "../../repositories/IServiceRepository";
import type { ServiceTierRef } from "../../entities/servicetier.types";


export class GetServiceTierUsecase {
  private serviceRepo: IServiceRepository;

  constructor(service: IServiceRepository) {
    this.serviceRepo = service;
  }

  async execute(): Promise<ServiceTierRef[]> {
    const response = await this.serviceRepo.getServiceTiers();
    
   
    return response || [];
  }
}





