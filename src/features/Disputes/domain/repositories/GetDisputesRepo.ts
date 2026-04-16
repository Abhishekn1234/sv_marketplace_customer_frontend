import type {  GetDisputesAllResponse } from "../entities/getdisputesall";
import type { GetDisputesQueryParams } from "../entities/getdisputesparams";

export interface GetDisputesRepo{
    getDisputes(params?:GetDisputesQueryParams):Promise<GetDisputesAllResponse>;
}