import { PlusIcon } from "@/components/icons";
import Button from "@/components/input/Button";
import { useLanguage } from "@/features/context/LanguageContext";


export default function CustomQuote() {
  const { t } = useLanguage();

  return (
    <div className="group flex flex-col items-center justify-center text-center bg-white border-2 border-dashed border-gray-200 rounded-[20px] p-8 min-h-[280px] cursor-pointer transition-all duration-300 hover:border-blue-600 hover:bg-gray-50">
      
      {/* Icon */}
      <div className="w-16 h-16 flex items-center justify-center mb-4 bg-blue-50 border-2 border-gray-200 rounded-full transition-all duration-300 group-hover:bg-blue-600 group-hover:border-blue-600">
        <PlusIcon className="text-black" />
      </div>

      {/* Title */}
      <h3 className="text-[20px] font-bold text-gray-900 mb-2">
        {t.customquote.title}
      </h3>

      {/* Description */}
      <p className="text-[14px] text-gray-500 leading-[1.6] mb-5">
        {t.customquote.description}
      </p>

      {/* Button */}
      <Button className="px-6 py-[10px] border-2 border-blue-600 text-blue-600 text-[14px] font-bold rounded-full transition-all duration-200 hover:bg-blue-600 hover:text-white">
        {t.customquote.button}
      </Button>

    </div>
  );
}