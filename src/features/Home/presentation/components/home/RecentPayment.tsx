import { LockIcon } from "@/components/icons";
import { useLanguage } from "@/features/context/LanguageContext";
import CommonCard from "@/components/common/CommonCards";

export default function SecurePayment() {
  const { t } = useLanguage();

  return (
    <CommonCard
      className="
        bg-green-50 hover:bg-green-100
        hover:shadow-lg
        transition-transform duration-200
        hover:-translate-y-0.5
        cursor-pointer
      "
    >
      <div className="flex items-center gap-3.5">
        {/* Icon */}
        <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-100 transition-transform duration-200 hover:scale-110">
          <LockIcon />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold uppercase tracking-wide mb-0.5 text-green-600">
            {t.home["Secure Payment"]}
          </div>
          <div className="text-sm text-gray-500">
            {t.home["SSL Encrypted"]}
          </div>
        </div>
      </div>
    </CommonCard>
  );
}