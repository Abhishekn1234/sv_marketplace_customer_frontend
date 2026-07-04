
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import type { Feature } from "../../domain/entities/feature";
import { useServiceCategory } from "@/features/Bookings/presentation/hooks/useServiceCategory";
import { useLanguage } from "@/features/context/LanguageContext";
import Button from "@/components/input/Button";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import CommonCard from "@/components/common/CommonCards";
import { ArrowLeftIcon, ArrowRight, CheckIcon, StarIcon, TickIcon } from "@/components/icons";
import { ServiceTierSelectionTierCard } from "./ServiceTierSelectionTierCard";
export default function ServiceTierSelectionContent() {
  const navigate = useNavigate();
  const {data:categories}=useServiceCategory();
  // console.log(categories);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
 const {t}=useLanguage();
  if (!categories) return <CommonSpinner/>;

  // ✅ Flatten services from categories
  const servicess =
    categories?.flatMap((category: any) => category.services) ?? [];
    // console.log(servicess);

  // ✅ Find the current service
  const currentService = servicess.find((s: any) => s._id === id);

  if (!currentService) return <p className="text-center">Service not found!</p>;

  const parseFeatures = (rawFeatures: any): Feature[] => {
    if (!rawFeatures) return [];

    try {
      if (Array.isArray(rawFeatures) && typeof rawFeatures[0] === "string") {
        return JSON.parse(rawFeatures[0]);
      }

      if (Array.isArray(rawFeatures)) return rawFeatures;

      if (typeof rawFeatures === "string") return JSON.parse(rawFeatures);
    } catch (error) {
      console.error("Feature parsing error:", error);
    }

    return [];
  };

  const getTierPrices = (tierId?: string) => {
    if (!tierId)
      return { hourly: 0, daily: 0, currency: currentService.currency || "SAR" };

    const matchedPricing = currentService.pricingTiers?.find(
      (pt: any) => pt?.tierId === tierId
    );

    if (!matchedPricing)
      return { hourly: 0, daily: 0, currency: currentService.currency || "SAR" };

    const currency = currentService.currency || "SAR";
    const commissionType = matchedPricing?.commissionType;
    const commissionValue = matchedPricing?.commissionValue || 0;

    let hourly = matchedPricing?.HOURLY?.ratePerHour || 0;
    let daily = matchedPricing?.PER_DAY?.ratePerDay || 0;

    if (commissionType === "PERCENTAGE") {
      hourly += (hourly * commissionValue) / 100;
      daily += (daily * commissionValue) / 100;
    } else if (commissionType === "FLAT") {
      hourly += commissionValue;
      daily += commissionValue;
    }

    return { hourly, daily, currency };
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
        {currentService.pricingTiers?.map((tier: any, index: number) => {
          const features = parseFeatures(tier?.tier?.features);

          return (
            <ServiceTierSelectionTierCard
              key={tier?.tierId}
              name={tier?.tier?.displayName ?? tier?.tier?.code}
              description={tier?.description}
              prices={getTierPrices(tier?.tierId)}
              features={features}
              recommended={index === 1}
              selected={selectedTierId === tier?.tierId}
              onSelect={() => setSelectedTierId(tier?.tierId)}
            />
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={handleContinue}
          rightIcon={
            <ArrowRight/>
          }
          className={`px-12 py-4 font-bold rounded-full flex items-center gap-2 transition-all duration-200 ${
            selectedTierId
              ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:-translate-y-1 hover:shadow-xl"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!selectedTierId}
        >
          {t.servicetierselectionpage.buttons.continue}
          
        </Button>

        <p className="text-sm text-gray-400 font-medium">
          {t.servicetierselectionpage["Prices may vary based on your home's square footage."]}
        </p>

        <Button
          onClick={() => navigate(-1)}
          leftIcon={
            <>
             <ArrowLeftIcon />
            </>
          }
          className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
        >
         
        {t.servicetierselectionpage.buttons.back}
        </Button>
      </div>
    </div>
  );
}


