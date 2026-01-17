import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
        <label className="block font-medium mb-1">Work Description *</label>
        <textarea
          value={workDescription}
          onChange={(e) => setWorkDescription(e.target.value)}
          placeholder="Describe the work in detail..."
          className="w-full p-2 border rounded-lg"
          rows={3}
        />
      </div>

      {/* Booking Type & Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Booking Type *</label>
          <select
            value={bookingType}
            onChange={(e) => setBookingType(e.target.value as any)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="INSTANT">Instant Booking</option>
            <option value="SCHEDULED">Schedule for Later</option>
          </select>
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

      {/* Pricing Mode, Duration, Workers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block font-medium mb-1">Pricing Mode *</label>
          <select
            value={pricingMode}
            onChange={(e) => {
              setPricingMode(e.target.value as any);
              if (e.target.value === "HOURLY") setEstimatedHours(1);
              else setEstimatedDays(1);
            }}
            className="w-full p-2 border rounded-lg"
          >
            <option value="HOURLY">Hourly Rate</option>
            <option value="PER_DAY">Daily Rate</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">
            {pricingMode === "HOURLY" ? "Estimated Hours *" : "Estimated Days *"}
          </label>
          <input
            type="number"
            min={1}
            value={pricingMode === "HOURLY" ? estimatedHours : estimatedDays}
            onChange={(e) => {
              const value = Math.max(1, Number(e.target.value));
              if (pricingMode === "HOURLY") setEstimatedHours(value);
              else setEstimatedDays(value);
            }}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Number of Workers *</label>
          <input
            type="number"
            min={1}
            value={numberOfWorkers}
            onChange={(e) => setNumberOfWorkers(Math.max(1, Number(e.target.value)))}
            className="w-full p-2 border rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
