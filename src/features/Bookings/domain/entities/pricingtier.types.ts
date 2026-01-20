export interface PricingTier {
  tierId: string;
  HOURLY?: { ratePerHour: number };
  PER_DAY?: { ratePerDay: number };
  commissionType: "PERCENTAGE" | "FIXED";
  commissionValue: number;
  _id: string;
  tier: {
    _id: string;
    code: string;           
    displayName: string;    
    description: string;    
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}