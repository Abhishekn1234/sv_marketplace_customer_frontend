import type { PricingTier } from "./pricingtier.types";
import type { ServiceCategoryObject } from "./servicecategoryobject.types";

export interface Service {
  _id: string;
  name: string;
  slug: string;

  category: ServiceCategoryObject;
  categories?: ServiceCategoryObject;

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

  // Optional fields commonly returned by APIs
  serviceCode?: string;
  displayName?: string;
  commissionValue?: number;
  commissionType?: string;
  basePrice?: number;
}

