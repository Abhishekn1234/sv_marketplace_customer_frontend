import { PricingMode } from "@/features/Bookings/domain/entities/pricinginput.types";

export interface ValidateCouponRequest {
  workDescription: string;
  couponCode: string;

  serviceId: string;
  serviceTierId: string;

  pricingMode: PricingMode;

  numberOfWorkers: number;

  bookingType: "INSTANT" | "SCHEDULED";

  startDateTime: string;

  estimatedHours: number;
  estimatedDays: number;

  location: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface AppliedDiscount {
  code: string;
  couponId: string;
  type: "PERCENTAGE" | "FIXED";
  amount: number;
  affectsCommission: boolean;
}

export interface ValidateCouponResponse {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;

  discountAmount: number;
  currency: string;

  amountBeforeDiscount: number;
  taxableAmount: number;
  taxAmount: number;
  totalCost: number;

  appliedDiscounts: AppliedDiscount[];
}