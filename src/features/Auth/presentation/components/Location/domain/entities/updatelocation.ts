import type { Geopoint } from "@/features/Bookings/domain/entities/geopoint.types";

export interface Address {
  id: string;
  type: "home" | "office" |"inputValue" | "other"| string;
  value: string;
}

export interface LastLocations {
  id?: string;
  addresses: Address[];
  lat?:number;
  lng?:number;
  coordinates?:Geopoint;
}