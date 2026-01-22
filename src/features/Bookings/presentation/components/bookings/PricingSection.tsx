import type { Service } from "../../../domain/entities/service.types";
import type { ServiceTierRef } from "../../../domain/entities/servicetier.types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      <Select value={pricingMode} onValueChange={(val: "HOURLY" | "PER_DAY") => setPricingMode(val)}>
        <SelectTrigger>
          <SelectValue placeholder="Select pricing mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="HOURLY">Hourly</SelectItem>
          <SelectItem value="PER_DAY">Per Day</SelectItem>
        </SelectContent>
      </Select>

      {/* Estimated Hours/Days Input */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>{pricingMode === "HOURLY" ? "Estimated Hours" : "Estimated Days"}</Label>
          <Input
            type="number"
            min={1}
            value={pricingMode === "HOURLY" ? estimatedHours : estimatedDays}
            onChange={(e) => {
              const val = Math.max(1, +e.target.value);
              pricingMode === "HOURLY" ? setEstimatedHours(val) : setEstimatedDays(val);
            }}
          />
        </div>

        {/* Number of Workers Input */}
        <div>
          <Label>Number of Workers</Label>
          <Input
            type="number"
            min={1}
            value={numberOfWorkers}
            onChange={(e) => setNumberOfWorkers(Math.max(1, +e.target.value))}
          />
        </div>
      </div>

      {/* Pricing Tier Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {service.pricingTiers.map(tier => {
          const tierInfo = serviceTiers.find(st => st._id === tier.tierId);
          return (
            <Button
              key={tier._id}
              variant={selectedTiers.includes(tier.tierId) ? "default" : "outline"}
              onClick={() => toggleTier(tier.tierId)}
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

