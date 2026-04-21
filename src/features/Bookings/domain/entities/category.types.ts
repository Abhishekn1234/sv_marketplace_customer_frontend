import type { Service } from "./service.types";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  vatRate?: number; 
  iconUrl?: string;
  iconPublicId?: string;
  services: Service[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  rating?:number;
}