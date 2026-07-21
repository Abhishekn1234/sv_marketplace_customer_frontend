import type { Service } from "./service.types";

export interface Category {
  _id: string;
  name: string;
  slug: string;

  description?: string;

  vatRate?: number;

  iconUrl?: string;
  iconPublicId?: string;

  services: Service[];

  rating?: number;

  createdAt?: string;
  updatedAt?: string;
}