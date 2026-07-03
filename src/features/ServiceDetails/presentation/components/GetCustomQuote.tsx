import { PlusIcon } from "@/components/icons";
import Button from "@/components/input/Button";
import { useLanguage } from "@/features/context/LanguageContext";
import CommonCard from "@/components/common/CommonCards";

export default function CustomQuote() {
  const { t } = useLanguage();

  return (
    <CommonCard
      className="group min-h-[280px] cursor-pointer rounded-[20px] border-2 border-dashed border-gray-200 transition-all duration-300 hover:border-blue-600 hover:bg-gray-50 hover:shadow-lg"
      contentClassName="flex h-full flex-col items-center justify-center p-8 text-center"
    >
      {/* Icon */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-200 bg-blue-50 transition-all duration-300 group-hover:border-blue-600 group-hover:bg-blue-600">
        <PlusIcon className="text-black group-hover:text-white" />
      </div>

      {/* Title */}
      <h3 className="mb-2 text-xl font-bold text-gray-900">
        {t.customquote.title}
      </h3>

      {/* Description */}
      <p className="mb-5 text-sm leading-6 text-gray-500">
        {t.customquote.description}
      </p>

      {/* Button */}
      <Button className="rounded-full border-2 border-blue-600 px-6 py-[10px] text-sm font-bold text-blue-600 transition-all duration-200 hover:bg-blue-600 hover:text-white">
        {t.customquote.button}
      </Button>
    </CommonCard>
  );
}