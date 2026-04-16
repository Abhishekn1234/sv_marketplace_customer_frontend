import type { GetDisputesQueryParams } from "../entities/getdisputesparams";
import type { GetDisputesRepo } from "../repositories/GetDisputesRepo";

export class GetDisputesUsecase{
    private getDisputesRepo:GetDisputesRepo;

    constructor(getDisputesRepo:GetDisputesRepo){
        this.getDisputesRepo=getDisputesRepo;
    }
    async execute(params?:GetDisputesQueryParams){
        return await this.getDisputesRepo.getDisputes(params);
    }

}