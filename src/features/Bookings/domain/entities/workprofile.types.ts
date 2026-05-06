import type { Geopoint } from "./geopoint.types";
import type { ServiceCategoryObject } from "./servicecategoryobject.types";
import type { ServiceTierRef } from "./servicetier.types";

export type WorkerProfile = {
  _id: string;
  userId: string;
  serviceTierIds: ServiceTierRef[];
  categoryIds: ServiceCategoryObject[];

 
  status: "ONLINE" | "OFFLINE" | "BUSY";

  location:Geopoint;

  serviceRadius: number;
};