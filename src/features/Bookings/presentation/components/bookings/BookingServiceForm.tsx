
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { Service } from "../../../domain/entities/service.types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectValue,SelectTrigger } from "@/components/ui/select";


type BookingType = "INSTANT" | "SCHEDULED";
interface BookingServiceFormProps {
  workDescription: string;
  setWorkDescription: (value: string) => void;
  bookingType: BookingType;
  setBookingType: (value: BookingType) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  pricingMode: "HOURLY" | "PER_DAY";
  setPricingMode: (value: "HOURLY" | "PER_DAY") => void;
  estimatedHours: number;
  setEstimatedHours: (value: number) => void;
  estimatedDays: number;
  setEstimatedDays: (value: number) => void;
  numberOfWorkers: number;
  setNumberOfWorkers: (value: number) => void;
  service: Service;
  selectedTiers: string[];
  handleTierClick: (tierId: string) => void;
  calculateTotalPrice: number;
  formatPrice: (price: number) => string;
  getDurationLabel: () => string;
  getWorkersLabel: () => string;
  serviceTiers: any[]; 
  tierNameMap: Record<string, string>;
}

export default function BookingServiceForm({
  workDescription,
  setWorkDescription,
  bookingType,
  setBookingType,
  startDate,
  setStartDate,
  pricingMode,
  setPricingMode,
  estimatedHours,
  setEstimatedHours,
  estimatedDays,
  setEstimatedDays,
  numberOfWorkers,
  setNumberOfWorkers,
  service,
  selectedTiers,
  handleTierClick,
  calculateTotalPrice,
  formatPrice,
  getDurationLabel,
  getWorkersLabel,
  serviceTiers,
  // tierNameMap,
}: BookingServiceFormProps) {
  return (
    <>
     
      <div>
        <Label className="block font-medium mb-1">Work Description *</Label>
        <Textarea
          value={workDescription}
          onChange={(e) => setWorkDescription(e.target.value)}
          placeholder="Describe the work in detail..."
          className="w-full p-2 border rounded-lg border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          required
        />
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
       <div>
  <Label className="block font-medium mb-1">Booking Type *</Label>
  <Select
    value={bookingType}
    onValueChange={(value) => setBookingType(value as BookingType)}
  >
    <SelectTrigger className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
      <SelectValue placeholder="Select Booking Type" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="INSTANT">Instant Booking (Start Now)</SelectItem>
      <SelectItem value="SCHEDULED">Schedule for Later</SelectItem>
    </SelectContent>
  </Select>
</div>
        {bookingType === "SCHEDULED" && (
          <div>
            <Label className="block font-medium mb-1">Start Date & Time *</Label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              showTimeSelect
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={new Date()}
              className="w-full p-2 border rounded-lg rounded-lg border-gray-300 dark:border-gray-600"
              placeholderText="Select date and time"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
  <Label className="block font-medium mb-1">Pricing Mode *</Label>
  <Select
    value={pricingMode}
    onValueChange={(value) => {
      setPricingMode(value as "HOURLY" | "PER_DAY");
      if (value === "HOURLY") {
        setEstimatedHours(1);
      } else {
        setEstimatedDays(1);
      }
    }}
  >
    <SelectTrigger className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
      <SelectValue placeholder="Select pricing mode" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="HOURLY">Hourly Rate</SelectItem>
      <SelectItem value="PER_DAY">Daily Rate</SelectItem>
    </SelectContent>
  </Select>
</div>

        <div>
          <Label className="block font-medium mb-1">
            {pricingMode === "HOURLY" ? "Estimated Hours *" : "Estimated Days *"}
          </Label>
          <Input
            type="number"
            min={pricingMode === "HOURLY" ? 1 : 1}
            value={pricingMode === "HOURLY" ? estimatedHours : estimatedDays}
            onChange={(e) => {
              const value = Math.max(1, Number(e.target.value));
              if (pricingMode === "HOURLY") {
                setEstimatedHours(value);
              } else {
                setEstimatedDays(value);
              }
            }}
            className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <Label className="block font-medium mb-1">Number of Workers *</Label>
          <Input
            type="number"
            min={1}
            value={numberOfWorkers}
            onChange={(e) => setNumberOfWorkers(Math.max(1, Number(e.target.value)))}
            className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

   
      <div>
        <Label className="block font-medium mb-2">
          Select Pricing Tiers * (Select one or more)
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
            Total: {formatPrice(calculateTotalPrice)}
          </span>
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {service.pricingTiers.map((tier) => {
            const rate =
              pricingMode === "HOURLY"
                ? tier.HOURLY?.ratePerHour
                : tier.PER_DAY?.ratePerDay;

            const tierInfo = serviceTiers.find((st) => st._id === tier.tierId);
            const tierName = tierInfo?.displayName ?? "Tier";
            
            return (
              <button
                key={tier._id}
                type="button"
                onClick={() => handleTierClick(tierInfo?._id ?? tier._id)}
                className={`border-2 p-4 rounded-lg text-left transition-all ${
                  selectedTiers.includes(tierInfo?._id ?? tier._id)
                    ? "shadow-lg ring-2 ring-opacity-50"
                    : ""
                }`}
              >
                <div className="font-medium">{tierName}</div>
                {rate && (
                  <div className="text-lg font-bold mt-1">
                    {formatPrice(
                      pricingMode === "HOURLY"
                        ? rate * estimatedHours * numberOfWorkers
                        : rate * estimatedDays * numberOfWorkers
                    )}
                  </div>
                )}
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {pricingMode === "HOURLY" 
                    ? `${rate} ${service.currency}/hour` 
                    : `${rate} ${service.currency}/day`
                  }
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedTiers.length > 0 && calculateTotalPrice > 0 && (
        <div className="bg-blue-100 dark:bg-blue-800/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold">Booking Summary</h4>
              <p className="text-sm text-black ">
                {selectedTiers.length} tier(s) selected • {getDurationLabel()} • {getWorkersLabel()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold ">
                {formatPrice(calculateTotalPrice)}
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {pricingMode === "HOURLY" ? "Hourly rate" : "Daily rate"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}