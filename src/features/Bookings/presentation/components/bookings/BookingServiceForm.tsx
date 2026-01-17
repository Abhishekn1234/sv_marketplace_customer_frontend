// import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { Service } from "../../../domain/entities/service.types";

interface BookingServiceFormProps {
  workDescription: string;
  setWorkDescription: (value: string) => void;
  bookingType: "INSTANT" | "SCHEDULED";
  setBookingType: (value: "INSTANT" | "SCHEDULED") => void;
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
  serviceTiers: any[]; // Replace with proper type
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
  tierNameMap,
}: BookingServiceFormProps) {
  return (
    <>
      {/* Work Description */}
      <div>
        <label className="block font-medium mb-1">Work Description *</label>
        <textarea
          value={workDescription}
          onChange={(e) => setWorkDescription(e.target.value)}
          placeholder="Describe the work in detail..."
          className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          required
        />
      </div>

      {/* Booking Type and Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Booking Type *</label>
          <select
            value={bookingType}
            onChange={(e) => setBookingType(e.target.value as any)}
            className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="INSTANT">Instant Booking (Start Now)</option>
            <option value="SCHEDULED">Schedule for Later</option>
          </select>
        </div>

        {bookingType === "SCHEDULED" && (
          <div>
            <label className="block font-medium mb-1">Start Date & Time *</label>
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

      {/* Pricing Mode and Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block font-medium mb-1">Pricing Mode *</label>
          <select
            value={pricingMode}
            onChange={(e) => {
              setPricingMode(e.target.value as any);
              if (e.target.value === "HOURLY") {
                setEstimatedHours(1);
              } else {
                setEstimatedDays(1);
              }
            }}
            className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block font-medium mb-1">Number of Workers *</label>
          <input
            type="number"
            min={1}
            value={numberOfWorkers}
            onChange={(e) => setNumberOfWorkers(Math.max(1, Number(e.target.value)))}
            className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Pricing Tiers with Price Calculation */}
      <div>
        <label className="block font-medium mb-2">
          Select Pricing Tiers * (Select one or more)
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
            Total: {formatPrice(calculateTotalPrice)}
          </span>
        </label>
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
                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-white shadow-lg ring-2 ring-blue-200 ring-opacity-50"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
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

      {/* Price Summary */}
      {selectedTiers.length > 0 && calculateTotalPrice > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-300">Booking Summary</h4>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {selectedTiers.length} tier(s) selected • {getDurationLabel()} • {getWorkersLabel()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
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