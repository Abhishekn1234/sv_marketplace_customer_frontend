 export const getPrice = (service: any) => {
    const tier = service.pricingTiers?.[0];
    if (!tier) return 0;
    if (tier.HOURLY) return tier.HOURLY.ratePerHour;
    if (tier.PER_DAY) return tier.PER_DAY.ratePerDay;
    return 0;
  };