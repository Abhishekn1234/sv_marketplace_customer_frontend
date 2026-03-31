import type { DisputeInput } from "../entities/disputeinput";

export interface AddDisputesRepo{
    addDispute(input:DisputeInput):Promise<void>;
}