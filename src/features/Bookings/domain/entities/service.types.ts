import type { PricingTier } from "./pricingtier.types";
import type { ServiceCategoryObject } from "./servicecategoryobject.types";

export interface Service {
  _id: string;
  name: string;
  slug: string;

  // ❌ remove string | union
  // category: string | ServiceCategoryObject;

  category: ServiceCategoryObject;  // ✅ always object now

  description: string;
  currency: string;
  pricingTiers: PricingTier[];

  isActive: boolean;
  avgRating: number;
  totalRatings: number;

  createdAt: string;
  updatedAt: string;

  iconUrl?: string;
  iconPublicId?: string;
  thumbnailUrl?: string;
  thumbnailPublicId?: string;

  rating?: string;
  price?: number;
}


