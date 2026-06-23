export function calculateAmount(
  pricingMode: string,
  rate: number = 0,
  minutesWorked: number = 0,
  workers: number = 1
) {
  if (!rate || !minutesWorked) return 0;

  if (pricingMode === "HOURLY") {
    const hours = minutesWorked / 60;
    return rate * hours * workers;
  }

  if (pricingMode === "PER_DAY") {
    const days = Math.ceil(minutesWorked / 1440);
    return rate * days * workers;
  }

  return 0;
}