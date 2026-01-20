import type { Service } from "./service.types";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  iconPublicId?: string;
  services: Service[];
  createdAt?: string;
  updatedAt?: string;
}