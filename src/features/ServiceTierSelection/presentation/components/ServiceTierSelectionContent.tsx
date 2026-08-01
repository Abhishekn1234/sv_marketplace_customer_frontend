import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import type { Feature } from "../../domain/entities/feature";


import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import { useLanguage } from "@/features/context/LanguageContext";

import Button from "@/components/input/Button";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import { ArrowLeftIcon, ArrowRight } from "@/components/icons";

import { ServiceTierSelectionTierCard } from "./ServiceTierSelectionTierCard";
import {PricingTier, ServiceTierDetails} from "@/features/Bookings/domain/entities/pricingtier.types"
export default function ServiceTierSelectionContent() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { t ,lang} = useLanguage();

  const { services: services, loading:isPending } = useServices({
    language:lang
  });

  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);

  if (isPending) {
    return <CommonSpinner center />;
  }

  const currentService = services?.find((service) => service._id === id);
  // console.log(currentService);
  if (!currentService) {
    return <p className="text-center">Service not found!</p>;
  }

  const parseFeatures = (rawFeatures: any): Feature[] => {
    if (!rawFeatures) return [];

    try {
      if (Array.isArray(rawFeatures) && typeof rawFeatures[0] === "string") {
        return JSON.parse(rawFeatures[0]);
      }

      if (Array.isArray(rawFeatures)) {
        return rawFeatures;
      }

      if (typeof rawFeatures === "string") {
        return JSON.parse(rawFeatures);
      }
    } catch (error) {
      console.error("Feature parsing error:", error);
    }

    return [];
  };

  const getTierPrices = (tierId?: string) => {
    if (!tierId) {
      return {
        hourly: 0,
        daily: 0,
        currency: currentService.currency || "SAR",
      };
    }

    const matchedPricing = currentService.pricingTiers?.find(
      (pt: PricingTier) => {
        if (typeof pt.tierId === "string") {
          return pt.tierId === tierId;
        }

        return pt.tierId._id === tierId;
      }
    );

    if (!matchedPricing) {
      return {
        hourly: 0,
        daily: 0,
        currency: currentService.currency || "SAR",
      };
    }

    let hourly = matchedPricing.HOURLY?.ratePerHour ?? 0;
    let daily = matchedPricing.PER_DAY?.ratePerDay ?? 0;

    const commissionType = matchedPricing.commissionType;
    const commissionValue = matchedPricing.commissionValue ?? 0;

    if (commissionType === "PERCENTAGE") {
      hourly += (hourly * commissionValue) / 100;
      daily += (daily * commissionValue) / 100;
    } else if (commissionType === "FLAT") {
      hourly += commissionValue;
      daily += commissionValue;
    }

    return {
      hourly,
      daily,
      currency: currentService.currency || "SAR",
    };
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto">
        {currentService.pricingTiers.map((pricingTier: PricingTier, index: number) => {
        const tier = pricingTier.tierId as ServiceTierDetails;

        const features = parseFeatures(tier.features);

        return (
          <ServiceTierSelectionTierCard
            key={tier._id}
            name={tier.displayName}
            description={tier?.description}
            prices={getTierPrices(tier._id)}
            features={features}
            recommended={index === 1}
            selected={selectedTierId === tier._id}
            onSelect={() => setSelectedTierId(tier._id)}
          />
        );
      })}
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={handleContinue}
          rightIcon={<ArrowRight />}
          disabled={!selectedTierId}
          className={`px-12 py-4 font-bold rounded-full flex items-center gap-2 transition-all duration-200 ${
            selectedTierId
              ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:-translate-y-1 hover:shadow-xl"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {t.servicetierselectionpage.buttons.continue}
        </Button>

        <p className="text-sm text-gray-400 font-medium">
          {
            t.servicetierselectionpage[
              "Prices may vary based on your home's square footage."
            ]
          }
        </p>

        <Button
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeftIcon />}
          className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
        >
          {t.servicetierselectionpage.buttons.back}
        </Button>
      </div>
    </div>
  );
}