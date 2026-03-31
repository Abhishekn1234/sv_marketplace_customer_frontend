import apiClient from "@/features/api/interceptor";
import type { DisputeInput } from "../../domain/entities/disputeinput";
import type { AddDisputesRepo } from "../../domain/repositories/AddDisputesRepo";

export class AddDisputesRepoImpl implements AddDisputesRepo{
  async addDispute(input: DisputeInput): Promise<void> {
      const response=await apiClient.post('/disputes/create',input);
      return response.data;
  }
}