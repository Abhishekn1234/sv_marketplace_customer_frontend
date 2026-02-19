import type { Location } from "../entities/location";
import type { LocationRepo } from "../repositories/LocationRepo";

export class AddLocationUsecase{
    private addloc:LocationRepo;
    constructor(addLocation:LocationRepo){
        this.addloc=addLocation;
    }

    async execute(payload:Location):Promise<Location>{
        return this.addloc.addLocation(payload)
    }
}