import {ServiceRepository} from "../../../data/repositories/ServiceRepository";
import type {APIResponse } from "../../entities/apiresponse.types";
import type { Category } from "../../entities/category.types";
export class GetServicesUseCase {
 private serviceRepo:ServiceRepository;
 constructor(service:ServiceRepository){
  this.serviceRepo=service;
 }

  async execute(): Promise<APIResponse<Category[]>> {
    return await this.serviceRepo.getServices();
  }
}  