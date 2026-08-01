import { LocalizedText } from "@/components/common/localizedtext.types";
import type { PricingTier } from "./pricingtier.types";
import type { ServiceCategoryObject } from "./servicecategoryobject.types";

export interface Service {
  _id: string;
  name: string; // API always returns a plain string for service.name
  slug: string;

  // API returns { "0": {...} }
  category: ServiceCategoryObject;

  // optional if used elsewhere
  categories?: ServiceCategoryObject[];

  vatRate?: number;

  description: string;
  currency: string;

  pricingTiers: PricingTier[];

  isActive: boolean;

  avgRating: number;
  totalRatings: number;
  rating?: number;

  price?: number;
  isFavorited?: boolean;

  iconUrl?: string;
  iconPublicId?: string;
  thumbnailUrl?: string;
  thumbnailPublicId?: string;

  createdAt: string;
  updatedAt: string;

  serviceCode?: string;
  displayName?: string;
  commissionValue?: number;
  commissionType?: string;
  basePrice?: number;
}