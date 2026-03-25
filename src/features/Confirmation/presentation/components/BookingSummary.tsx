"use client";
import SummaryItem from "./SummaryItem";
import { formatSmartDate } from "../helpers/formatdatetime";

interface BookingSummaryProps {
  data: any;
  placeName: string;
  tierName: string;
}

export default function BookingSummary({ data, placeName, tierName }: BookingSummaryProps) {
  const duration =
    data?.pricingMode === "HOURLY"
      ? `${data?.schedule?.estimatedHours ?? 0} Hours`
      : data?.pricingMode === "PER_DAY"
      ? `${data?.schedule?.estimatedDays ?? 0} Days`
      : "N/A";

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden mb-8 shadow-lg text-left">
      <div className="px-6 py-5 bg-gray-50 border-b-2 border-gray-200">
        <h3 className="text-xs font-bold uppercase text-gray-400">Booking Summary</h3>
      </div>

      <div className="px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <SummaryItem label="Service" value={data?.service?.name} />
          <SummaryItem label="Tier" value={tierName} />
          <SummaryItem label="Time & Date" value={formatSmartDate(data?.schedule?.startDateTime)} />
          <SummaryItem label="Location" value={placeName} />
          <SummaryItem label="Duration" value={duration} />
          <SummaryItem label="Total Paid" value={<span className="text-blue-600">{data?.currency} {data?.amount}</span>} />
        </div>

        {/* Info Box */}
        <div className="flex items-start gap-4 p-5 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-emerald-500">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">Provider Assignment in Progress</h4>
            <p className="text-sm text-gray-500">
              We're assigning the best provider for your location. You'll receive a notification once confirmed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}