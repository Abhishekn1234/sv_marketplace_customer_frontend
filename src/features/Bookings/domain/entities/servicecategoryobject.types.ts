
import { LocalizedText } from "@/components/common/localizedtext.types";
import type { Service } from "./service.types";

export interface ServiceCategoryObject {
  _id: string;

  name: LocalizedText;
  slug: string;

  description?: LocalizedText;

  iconUrl?: string;
  iconPublicId?: string;

  vatRate?: number;

  services?: Service[];

  createdAt?: string;
  updatedAt?: string;
}