import type { PricingInput } from "../../domain/entities/pricinginput.types";

export function calculateWorkAmount({
  pricingMode,
  ratePerHour,
  ratePerDay,
  actualWorkHours,
  actualWorkDays,
  actualWorkMinutes,
}: PricingInput): number {
  let amount = 0;

  // =========================
  // HOURLY
  // =========================
  if (pricingMode === "HOURLY") {
    const hours =
      actualWorkHours ??
      (actualWorkMinutes != null ? actualWorkMinutes / 60 : 0);

    amount = (ratePerHour ?? 0) * hours;
  }

  // =========================
  // DAILY
  // =========================
  if (pricingMode === "PER_DAY") {
    const days = actualWorkDays ?? 0;

    amount = (ratePerDay ?? 0) * days;
  }

  return Number(amount.toFixed(2));
}