import type { Geopoint } from "@/features/Bookings/domain/entities/geopoint.types";

type AddressType = "home" | "inputValue" |"other" |"office";

export type Address = {
  id: string;
  type: AddressType;
  value: string;
  lat?: number;
  lng?: number;
};

export interface LastLocations {
  id?: string;
  addresses: Address[];
  lat?:number;
  lng?:number;
  coordinates?:Geopoint;
}