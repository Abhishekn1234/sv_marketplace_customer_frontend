import { useLanguage } from "@/features/context/LanguageContext";

export default function ChangePasswordHeader() {
  const { t, isRTLOrder } = useLanguage();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 mt-5 pb-6 sm:pb-2">
      <div
        className={`max-w-4xl mx-auto ${
          isRTLOrder ? "text-right" : "text-left"
        }`}
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
          {t.changepasswordpage.title}
        </h1>

        <p className="mt-2 text-sm sm:text-base text-gray-500 leading-relaxed">
          {t.changepasswordpage.description}
        </p>
      </div>
    </div>
  );
}