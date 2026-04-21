export type PricingMode = "HOURLY" | "PER_DAY";
export interface PricingInput {
  pricingMode: PricingMode;
  ratePerHour?: number;
  ratePerDay?: number;
  actualWorkHours?: number;
  actualWorkDays?: number;
  actualWorkMinutes?: number;
}