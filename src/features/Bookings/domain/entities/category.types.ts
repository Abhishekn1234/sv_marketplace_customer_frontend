import type { Service } from "./service.types";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  iconPublicId?: string;
  services: Service[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}