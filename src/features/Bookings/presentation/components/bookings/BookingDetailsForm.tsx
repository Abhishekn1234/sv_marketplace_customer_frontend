import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


import { Input, Label, Textarea } from "@/components/input";
import Select from "@/components/input/Select";



interface BookingDetailsFormProps {
  workDescription: string;
  setWorkDescription: (val: string) => void;
  bookingType: "INSTANT" | "SCHEDULED";
  setBookingType: (val: "INSTANT" | "SCHEDULED") => void;
  pricingMode: "HOURLY" | "PER_DAY";
  setPricingMode: (val: "HOURLY" | "PER_DAY") => void;
  estimatedHours: number;
  setEstimatedHours: (val: number) => void;
  estimatedDays: number;
  setEstimatedDays: (val: number) => void;
  numberOfWorkers: number;
  setNumberOfWorkers: (val: number) => void;
  startDate: Date | null;
  setStartDate: (val: Date | null) => void;
}

export default function BookingDetailsForm({
  workDescription,
  setWorkDescription,
  bookingType,
  setBookingType,
  pricingMode,
  setPricingMode,
  estimatedHours,
  setEstimatedHours,
  estimatedDays,
  setEstimatedDays,
  numberOfWorkers,
  setNumberOfWorkers,
  startDate,
  setStartDate,
}: BookingDetailsFormProps) {
  return (
    <div className="space-y-4">

      
      <div>
        <Label className="block font-medium mb-1">Work Description *</Label>
        <Textarea
          value={workDescription}
          onChange={(e) => setWorkDescription(e.target.value)}
          placeholder="Describe the work in detail..."
          className="w-full"
          rows={3}
        />
      </div>

      {/* Booking Type & Start Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="block font-medium mb-1">Booking Type *</Label>
                  <Select
            value={bookingType}
            onChange={(val) => setBookingType(val as "INSTANT" | "SCHEDULED")}
            options={[
              { label: "Instant Booking", value: "INSTANT" },
              { label: "Schedule for Later", value: "SCHEDULED" },
            ]}
            placeholder="Select booking type"
          />
        </div>

        {bookingType === "SCHEDULED" && (
          <div>
            <label className="block font-medium mb-1">Start Date & Time *</label>
            <DatePicker
              selected={startDate}
              onChange={(date: any) => setStartDate(date)}
              showTimeSelect
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={new Date()}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Pricing Mode, Duration, Number of Workers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label className="block font-medium mb-1">Pricing Mode *</Label>
        <Select
  value={pricingMode}
  onChange={(val) => {
    setPricingMode(val as "HOURLY" | "PER_DAY");

    if (val === "HOURLY") {
      setEstimatedHours(1);
    } else {
      setEstimatedDays(1);
    }
  }}
  options={[
    { label: "Hourly Rate", value: "HOURLY" },
    { label: "Daily Rate", value: "PER_DAY" },
  ]}
  placeholder="Select pricing mode"
/>
        </div>

        <div>
          <Label className="block font-medium mb-1">
            {pricingMode === "HOURLY" ? "Estimated Hours *" : "Estimated Days *"}
          </Label>
          <Input
              type="number"
              min={1}
              value={
                pricingMode === "HOURLY"
                  ? String(estimatedHours)
                  : String(estimatedDays)
              }
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

        <div>
          <Label className="block font-medium mb-1">Number of Workers *</Label>
                    <Input
              type="number"
              min={1}
              value={String(numberOfWorkers)}
              onChange={(value) => {
                const num = Math.max(1, Number(value || 1));
                setNumberOfWorkers(num);
              }}
            />
        </div>
      </div>
    </div>
  );
}
