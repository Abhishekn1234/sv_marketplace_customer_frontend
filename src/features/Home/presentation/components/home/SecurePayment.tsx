import { LockIcon } from "@/components/icons";
import { useLanguage } from "@/features/context/LanguageContext";
import CommonCard from "@/components/common/CommonCards";

export default function SecurePayment() {
  const { t } = useLanguage();

  return (
    <CommonCard
      className="
        bg-green-50 hover:bg-green-100
        transition-all duration-200
        hover:-translate-y-0.5
        cursor-pointer
      "
      contentClassName="p-4"
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-green-100 transition-transform duration-200 hover:scale-110">
          <LockIcon className="h-4 w-4" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 text-[11px] font-bold uppercase tracking-wide text-green-600">
            {t.home["Secure Payment"]}
          </div>
          <div className="text-xs text-gray-500">
            {t.home["SSL Encrypted"]}
          </div>
        </div>
      </div>
    </CommonCard>
  );
}