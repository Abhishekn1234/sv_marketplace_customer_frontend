// import { useMemo, useCallback } from "react";
// import type { Service } from "../../../domain/entities/service.types";

// interface PricingTiersSelectorProps {
//   service: Service;
//   pricingMode: "HOURLY" | "PER_DAY";
//   estimatedHours: number;
//   estimatedDays: number;
//   numberOfWorkers: number;
//   selectedTiers: string[];
//   setSelectedTiers: (tiers: string[]) => void;
// }

// export default function PricingTiersSelector({
//   service,
//   pricingMode,
//   estimatedHours,
//   estimatedDays,
//   numberOfWorkers,
//   selectedTiers,
//   setSelectedTiers,
// }: PricingTiersSelectorProps) {
//   const handleTierClick = useCallback((tierId: string) => {
//     setSelectedTiers((prev) =>
//       prev.includes(tierId) ? prev.filter((id) => id !== tierId) : [...prev, tierId]
//     );
//   }, [setSelectedTiers]);

//   const totalPrice = useMemo(() => {
//     if (selectedTiers.length === 0) return 0;

//     let total = 0;
//     selectedTiers.forEach((tierId) => {
//       const tier = service.pricingTiers.find((t) => t.tierId === tierId);
//       if (!tier) return;

//       if (pricingMode === "HOURLY" && tier.HOURLY?.ratePerHour) {
//         total += tier.HOURLY.ratePerHour * estimatedHours * numberOfWorkers;
//       }
//       if (pricingMode === "PER_DAY" && tier.PER_DAY?.ratePerDay) {
//         total += tier.PER_DAY.ratePerDay * estimatedDays * numberOfWorkers;
//       }
//     });
//     return total;
//   }, [selectedTiers, service, pricingMode, estimatedHours, estimatedDays, numberOfWorkers]);

//   return (
//     <div>
//       <label className="block font-medium mb-2">
//         Select Pricing Tiers * (Total: {totalPrice.toFixed(2)})
//       </label>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//         {service.pricingTiers.map((tier) => {
//           const rate = pricingMode === "HOURLY" ? tier.HOURLY?.ratePerHour : tier.PER_DAY?.ratePerDay;
//           const tierTotal = rate ? rate * (pricingMode === "HOURLY" ? estimatedHours : estimatedDays) * numberOfWorkers : 0;

//           return (
//             <button
//               key={tier._id}
//               type="button"
//               onClick={() => handleTierClick(tier.tierId)}
//               className={`p-2 border rounded-lg ${selectedTiers.includes(tier.tierId) ? "bg-blue-100 border-blue-500" : ""}`}
//             >
//               {tier.tierId} - {tierTotal.toFixed(2)}
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
