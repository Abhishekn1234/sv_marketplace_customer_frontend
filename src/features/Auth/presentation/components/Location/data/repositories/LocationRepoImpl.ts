import apiClient from "@/features/api/interceptor";
import type { Location } from "../../domain/entities/location";
import type { LocationRepo } from "../../domain/repositories/LocationRepo";

export class LocationRepoImpl implements LocationRepo{
   async addLocation(data:Location): Promise<Location>{
      const response=await apiClient.post('/locations',data);
      return response.data;
   };
}