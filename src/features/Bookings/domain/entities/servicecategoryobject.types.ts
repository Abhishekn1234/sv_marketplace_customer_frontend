import type { Service } from "./service.types";

export interface ServiceCategoryObject {
  _id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  iconPublicId?: string;
  services?: Service[]; 
  createdAt?: string;
  updatedAt?: string;
}