import { ShieldIcon } from "@/components/icons";
import { useLanguage } from "@/features/context/LanguageContext";
import CommonCard from "@/components/common/CommonCards";

export default function SatisfactionGuarantee() {
  const { t } = useLanguage();

  return (
    <CommonCard
      className="
        bg-yellow-50 hover:bg-yellow-100
        transition-all duration-200
        hover:-translate-y-0.5
        cursor-pointer
      "
      contentClassName="p-4"
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-yellow-100 transition-transform duration-200 hover:scale-110">
          <ShieldIcon  />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 text-[11px] font-bold uppercase tracking-wide text-yellow-600">
            {t.home["Satisfaction Guarantee"]}
          </div>
          <div className="text-xs text-gray-500">
            {t.home["Money Back"]}
          </div>
        </div>
      </div>
    </CommonCard>
  );
}