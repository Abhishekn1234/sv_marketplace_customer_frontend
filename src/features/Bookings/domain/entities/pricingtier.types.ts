export interface ServiceTierDetails {
  _id: string;
  code: string;
  displayName: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PricingTier {
  _id: string;

  tierId: ServiceTierDetails;   // ✅ now full object

  HOURLY: {
    ratePerHour: number;
  };

  PER_DAY: {
    ratePerDay: number;
  };

  commissionType: string;
  commissionValue: number;
}
