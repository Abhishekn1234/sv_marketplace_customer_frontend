import type { DisputeInput } from "../entities/disputeinput";
import type { AddDisputesRepo } from "../repositories/AddDisputesRepo";

export class CreateDisputeUsecase{
    private addDisputesRepo:AddDisputesRepo;
    constructor(addDisputes:AddDisputesRepo){
        this.addDisputesRepo=addDisputes;
    }
    async execute(input:DisputeInput):Promise<void>{
        return this.addDisputesRepo.addDispute(input);
    }
}