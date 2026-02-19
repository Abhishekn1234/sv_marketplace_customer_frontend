import type { Location } from "../entities/location";

export interface LocationRepo{
    addLocation:(data:Location)=>Promise<Location>
}