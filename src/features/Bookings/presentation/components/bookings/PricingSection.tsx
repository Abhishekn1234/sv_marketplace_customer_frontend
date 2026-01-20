import type { Service } from "../../../domain/entities/service.types";
import type { ServiceTierRef } from "../../../domain/entities/servicetier.types";

interface Props {
  service: Service;
  serviceTiers: ServiceTierRef[];
  pricingMode: "HOURLY" | "PER_DAY";
  setPricingMode: Function;
  estimatedHours: number;
  setEstimatedHours: Function;
  estimatedDays: number;
  setEstimatedDays: Function;
  numberOfWorkers: number;
  setNumberOfWorkers: Function;
  selectedTiers: string[];
  setSelectedTiers: Function;
  totalPrice: number;
}

export default function PricingSection({
  service,
  serviceTiers,
  pricingMode,
  setPricingMode,
  estimatedHours,
  setEstimatedHours,
  estimatedDays,
  setEstimatedDays,
  numberOfWorkers,
  setNumberOfWorkers,
  selectedTiers,
  setSelectedTiers,
  totalPrice,
}: Props) {

  const toggleTier = (id: string) => {
    setSelectedTiers((prev: string[]) =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <h4 className="font-semibold mb-2">Pricing</h4>

      <select
        value={pricingMode}
        onChange={e => setPricingMode(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="HOURLY">Hourly</option>
        <option value="PER_DAY">Per Day</option>
      </select>

      <input
        type="number"
        min={1}
        value={pricingMode === "HOURLY" ? estimatedHours : estimatedDays}
        onChange={e =>
          pricingMode === "HOURLY"
            ? setEstimatedHours(+e.target.value)
            : setEstimatedDays(+e.target.value)
        }
        className="border p-2 rounded"
      />

      <input
        type="number"
        min={1}
        value={numberOfWorkers}
        onChange={e => setNumberOfWorkers(+e.target.value)}
        className="border p-2 rounded"
      />

      <div className="grid grid-cols-2 gap-2 mt-2">
        {service.pricingTiers.map(tier => {
          const tierInfo = serviceTiers.find(st => st._id === tier.tierId);
          return (
            <button
              key={tier._id}
              onClick={() => toggleTier(tier.tierId)}
              className={`border p-2 rounded ${
                selectedTiers.includes(tier.tierId) ? "bg-blue-100" : ""
              }`}
            >
              {tierInfo?.displayName ?? "Tier"}
            </button>
          );
        })}
      </div>

      <p className="mt-2 font-bold">Total: {totalPrice}</p>
    </div>
  );
}
