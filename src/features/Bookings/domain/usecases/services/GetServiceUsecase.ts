import {ServiceRepository} from "../../../data/repositories/ServiceRepository";
import type { Category,APIResponse } from "../../entities/service.types";
export class GetServicesUseCase {
 private serviceRepo:ServiceRepository;
 constructor(service:ServiceRepository){
  this.serviceRepo=service;
 }

  async execute(): Promise<APIResponse<Category[]>> {
    return await this.serviceRepo.getServices();
  }
}  