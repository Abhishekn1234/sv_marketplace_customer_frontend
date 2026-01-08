// src/types/service.types.ts

// Tier structure for pricing
export interface PricingTier {
  tierId: string;
  HOURLY?: { ratePerHour: number };
  PER_DAY?: { ratePerDay: number };
  commissionType: "PERCENTAGE" | "FIXED";
  commissionValue: number;
  _id: string;
  tier: {
    _id: string;
    code: string;           // e.g., "experienced", "normal"
    displayName: string;    // e.g., "Experienced"
    description: string;    // e.g., "2 - 4 years exp"
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

// Service object
export interface Service {
  _id: string;
  name: string;
  slug: string;
  category: string | ServiceCategoryObject; // API may return ID string or category object
  description: string;
  currency: string;            // e.g., "SAR"
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
  // optional computed price (can be set client-side)
  price?: number;
}

// Service category object
export interface ServiceCategoryObject {
  _id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  iconPublicId?: string;
  services?: Service[]; // nested services
  createdAt?: string;
  updatedAt?: string;
}

// Category with services
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

// Pagination info
export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Full API response type
export interface APIResponse<T> {
  data: T;
  pagination?: Pagination;
}

