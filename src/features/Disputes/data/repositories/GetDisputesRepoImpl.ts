import apiClient from "@/features/api/interceptor";
import type { GetDisputesAllResponse } from "../../domain/entities/getdisputesall";
import type { GetDisputesQueryParams } from "../../domain/entities/getdisputesparams";
import type { GetDisputesRepo } from "../../domain/repositories/GetDisputesRepo";

export class GetDisputesRepoImpl implements GetDisputesRepo{
    async getDisputes(params?: GetDisputesQueryParams): Promise<GetDisputesAllResponse> {
        const response=await apiClient.get<GetDisputesAllResponse>("/disputes/mine",{
            params
        });
        return response.data;
    }
}