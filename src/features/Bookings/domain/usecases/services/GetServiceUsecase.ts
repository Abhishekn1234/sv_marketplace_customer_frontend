import {ServiceRepository} from "../../../data/repositories/ServiceRepository";
import type {APIResponse } from "../../entities/apiresponse.types";

import type { Service } from "../../entities/service.types";
export class GetServicesUseCase {
 private serviceRepo:ServiceRepository;
 constructor(service:ServiceRepository){
  this.serviceRepo=service;
 }

 execute(params?: GetServicesParams): Promise<APIResponse<Service[]>> {
  return this.serviceRepo.getServices(params);
}
}  