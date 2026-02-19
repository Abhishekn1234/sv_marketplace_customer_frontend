import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

export default function ServiceTierSelectionContent() {
  const navigate = useNavigate();
  const { serviceTiers, services } = useServices();
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const { id } = useParams();

  // ✅ Robust Feature Parser
  const parseFeatures = (rawFeatures: any): Feature[] => {
    if (!rawFeatures) return [];

    try {
      // Case 1: Array with JSON string inside
      if (Array.isArray(rawFeatures) && typeof rawFeatures[0] === "string") {
        return JSON.parse(rawFeatures[0]);
      }

      // Case 2: Already array of objects
      if (Array.isArray(rawFeatures)) {
        return rawFeatures;
      }

      // Case 3: Single JSON string
      if (typeof rawFeatures === "string") {
        return JSON.parse(rawFeatures);
      }
    } catch (error) {
      console.error("Feature parsing error:", error);
    }

    return [];
  };

  // ✅ Get calculated prices
  const getTierPrices = (tierId?: string) => {
    if (!tierId || !services) return { hourly: 0, daily: 0, currency: "SAR" };

    for (const service of services) {
      const matchedPricing = service?.pricingTiers?.find(
        (pt: any) => pt?.tierId?._id === tierId
      );

      if (matchedPricing) {
        const currency = service?.currency || "SAR";
        const commissionType = matchedPricing?.commissionType;
        const commissionValue = matchedPricing?.commissionValue || 0;

        let hourly = 0;
        let daily = 0;

        if (matchedPricing?.HOURLY?.ratePerHour != null) {
          hourly = matchedPricing.HOURLY.ratePerHour;
          if (commissionType === "PERCENTAGE")
            hourly += (hourly * commissionValue) / 100;
          else if (commissionType === "FLAT") hourly += commissionValue;
        }

        if (matchedPricing?.PER_DAY?.ratePerDay != null) {
          daily = matchedPricing.PER_DAY.ratePerDay;
          if (commissionType === "PERCENTAGE")
            daily += (daily * commissionValue) / 100;
          else if (commissionType === "FLAT") daily += commissionValue;
        }

        return { hourly, daily, currency };
      }
    }

    return { hourly: 0, daily: 0, currency: "SAR" };
  };

  const handleContinue = () => {
    if (!selectedTierId) {
      alert("Please select a tier before continuing!");
      return;
    }

    navigate(`/bookingdetail/${id}/${selectedTierId}`);
  };

  return (
    <div className="px-6 lg:px-8 pb-20">
      {/* ================= TIER GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto">
        {serviceTiers?.map((tier, index) => {
          const features = parseFeatures(tier.features);

          return (
            <TierCard
              key={tier._id}
              name={tier.displayName ?? ""}
              description={tier.description}
              prices={getTierPrices(tier._id)}
              features={features}
              recommended={index === 1}
              selected={selectedTierId === tier._id}
              onSelect={() => setSelectedTierId(tier._id)}
            />
          );
        })}
      </div>

      {/* ================= CTA SECTION ================= */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleContinue}
          className={`px-12 py-4 font-bold rounded-full flex items-center gap-2 transition-all duration-200 ${
            selectedTierId
              ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:-translate-y-1 hover:shadow-xl"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!selectedTierId}
        >
          Continue to Schedule
          <ArrowRight />
        </button>

        <p className="text-sm text-gray-400 font-medium">
          Prices may vary based on your home's square footage.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
        >
          <ArrowLeft />
          Back to Service Selection
        </button>
      </div>
    </div>
  );
}

interface Feature {
  text: string;
  included: boolean;
}

interface TierCardProps {
  name: string;
  description: string;
  prices: { hourly: number; daily: number; currency: string };
  features: Feature[];
  recommended?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

function TierCard({
  name,
  description,
  prices,
  features,
  recommended,
  selected,
  onSelect,
}: TierCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`relative border-2 rounded-3xl p-8 flex flex-col transition-all duration-300 cursor-pointer ${
        recommended
          ? "border-yellow-400 shadow-[0_8px_32px_rgba(245,158,11,0.15)] scale-105 z-10"
          : "border-gray-200 hover:border-blue-600 hover:shadow-2xl hover:-translate-y-1"
      } ${selected ? "border-blue-600 shadow-2xl scale-105" : ""}`}
    >
      {recommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-white text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-full shadow-md flex items-center gap-2">
          <StarIcon />
          Recommended
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-sm text-gray-500 font-medium">{description}</p>
      </div>

      <div className="flex flex-col gap-1 mb-6">
        {prices.hourly > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-gray-900">
              {prices.currency} {prices.hourly.toFixed(2)}
            </span>
            <span className="text-gray-400 font-semibold">/hr</span>
          </div>
        )}
        {prices.daily > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-gray-900">
              {prices.currency} {prices.daily.toFixed(2)}
            </span>
            <span className="text-gray-400 font-semibold">/day</span>
          </div>
        )}
      </div>

      <ul className="flex-1 mb-8 space-y-3">
        {features.map((feature, index) => (
          <li
            key={index}
            className={`flex items-start gap-3 text-sm font-medium ${
              feature.included
                ? "text-gray-600"
                : "text-gray-400 opacity-60"
            }`}
          >
            <CheckIcon included={feature.included} />
            {feature.text}
          </li>
        ))}
      </ul>

      <button
        className={`w-full h-12 rounded-full font-bold text-sm transition-all duration-200 ${
          selected
            ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:-translate-y-1"
            : "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
        }`}
      >
        {selected ? `Selected : ${name}` : `Select ${name}`}
      </button>
    </div>
  );
}

function CheckIcon({ included }: { included: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={`w-5 h-5 mt-0.5 ${
        included ? "text-blue-600" : "text-gray-300"
      }`}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 stroke-current"
      fill="none"
      strokeWidth={2}
    >
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 stroke-current"
      fill="none"
      strokeWidth={2}
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}
