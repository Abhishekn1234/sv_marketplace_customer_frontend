import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Label } from "@/components/ui/label";

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

      {/* Work Description */}
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
          <Select value={bookingType} onValueChange={(val) => setBookingType(val as any)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select booking type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INSTANT">Instant Booking</SelectItem>
              <SelectItem value="SCHEDULED">Schedule for Later</SelectItem>
            </SelectContent>
          </Select>
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
            onValueChange={(val) => {
              setPricingMode(val as any);
              if (val === "HOURLY") setEstimatedHours(1);
              else setEstimatedDays(1);
            }}
          >
            <SelectTrigger className="w-full">
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
            min={1}
            value={pricingMode === "HOURLY" ? estimatedHours : estimatedDays}
            onChange={(e) => {
              const value = Math.max(1, Number(e.target.value));
              if (pricingMode === "HOURLY") setEstimatedHours(value);
              else setEstimatedDays(value);
            }}
          />
        </div>

        <div>
          <Label className="block font-medium mb-1">Number of Workers *</Label>
          <Input
            type="number"
            min={1}
            value={numberOfWorkers}
            onChange={(e) => setNumberOfWorkers(Math.max(1, Number(e.target.value)))}
          />
        </div>
      </div>
    </div>
  );
}
