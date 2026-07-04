import { useLanguage } from "@/features/context/LanguageContext";
import { Feature } from "../../domain/entities/feature";
import { StarIcon, TickIcon } from "@/components/icons";
import Button from "@/components/input/Button";

interface TierCardProps {
  name: string;
  description: string;
  prices: { hourly: number; daily: number; currency: string };
  features: Feature[];
  recommended?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

export function ServiceTierSelectionTierCard({
  name,
  description,
  prices,
  features,

  recommended,
  selected,
  onSelect,
}: TierCardProps) {
 const{t}=useLanguage();
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
         {t.servicetierselectionpage.Recommended}
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
            <span className="text-gray-400 font-semibold">{t.common["/hr"]}</span>
          </div>
        )}

        {prices.daily > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-gray-900">
              {prices.currency} {prices.daily.toFixed(2)}
            </span>
            <span className="text-gray-400 font-semibold">{t.common["/day"]}</span>
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
          <TickIcon color="text-blue-400" />
          {feature.text}
        </li>
      ))}
      </ul>

      <Button
        className={`w-full h-12 rounded-full font-bold text-sm transition-all duration-200 ${
          selected
            ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:-translate-y-1"
            : "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
        }`}
      >
        {selected ? `${t.notificationpage.selected} : ${name}` : `${t.servicedetailpage.Select} ${name}`}
      </Button>
    </div>
  );
}
