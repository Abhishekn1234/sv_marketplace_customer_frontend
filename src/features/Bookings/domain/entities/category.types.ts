import { LocalizedText } from "@/components/common/localizedtext.types";
import type { Service } from "./service.types";

export interface Category {
  _id: string;

  name: string | LocalizedText;
  description?: string | LocalizedText;

  slug: string;
  vatRate?: number;

  iconUrl?: string;
  iconPublicId?: string;

  services: Service[];

  rating?: number;

  createdAt?: string;
  updatedAt?: string;
}