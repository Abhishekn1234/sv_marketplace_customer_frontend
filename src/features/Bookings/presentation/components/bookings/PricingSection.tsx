import { Input, Label } from "@/components/input";
import type { Service } from "../../../domain/entities/service.types";
import type { ServiceTierRef } from "../../../domain/entities/servicetier.types";

import Button from "@/components/input/Button";
import Select from "@/components/input/Select";

interface Props {
  service: Service;
  serviceTiers: ServiceTierRef[];
  pricingMode: "HOURLY" | "PER_DAY";
  setPricingMode: (mode: "HOURLY" | "PER_DAY") => void;
  estimatedHours: number;
  setEstimatedHours: (val: number) => void;
  estimatedDays: number;
  setEstimatedDays: (val: number) => void;
  numberOfWorkers: number;
  setNumberOfWorkers: (val: number) => void;
  selectedTiers: string[];
  setSelectedTiers: (tiers: string[]) => void;
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
    setSelectedTiers(
      selectedTiers.includes(id) ? selectedTiers.filter(t => t !== id) : [...selectedTiers, id]
    );
  };

  return (
    <div className="space-y-4">
      <Label>Pricing</Label>

      {/* Pricing Mode Select */}
            <Select
        value={pricingMode}
        onChange={(val) =>
          setPricingMode(val as "HOURLY" | "PER_DAY")
        }
        options={[
          { label: "Hourly", value: "HOURLY" },
          { label: "Per Day", value: "PER_DAY" },
        ]}
        placeholder="Select pricing mode"
      />
      {/* Estimated Hours/Days Input */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>{pricingMode === "HOURLY" ? "Estimated Hours" : "Estimated Days"}</Label>
         <Input
  type="number"
  min={1}
  value={String(
    pricingMode === "HOURLY" ? estimatedHours : estimatedDays
  )}
  onChange={(val) => {
    const num = Math.max(1, Number(val || 1));

    if (pricingMode === "HOURLY") {
      setEstimatedHours(num);
    } else {
      setEstimatedDays(num);
    }
  }}
/>
        </div>

        {/* Number of Workers Input */}
        <div>
          <Label>Number of Workers</Label>
                  <Input
          type="number"
          min={1}
          value={String(numberOfWorkers)}
          onChange={(val) => {
            const num = Math.max(1, Number(val || 1));
            setNumberOfWorkers(num);
          }}
        />
        </div>
      </div>

      {/* Pricing Tier Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {service.pricingTiers.map(tier => {
          const tierInfo = serviceTiers.find(st => st._id === tier.tier?._id);
          return (
            <Button
              key={tier._id}
              variant={selectedTiers.includes(tier._id) ? "ghost" : "primary"}
              onClick={() => toggleTier(tier._id)}
            >
              {tierInfo?.displayName ?? "Tier"}
            </Button>
          );
        })}
      </div>

      {/* Total Price */}
      <p className="mt-2 font-bold">Total: {totalPrice}</p>
    </div>
  );
}

