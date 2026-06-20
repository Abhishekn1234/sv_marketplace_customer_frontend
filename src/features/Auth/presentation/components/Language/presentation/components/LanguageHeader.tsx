import { useLanguage } from "@/features/context/LanguageContext";

export default function LanguageHeader() {
  const { t } = useLanguage();

  return (
    <div className="mt-8 text-center px-4">
      <h1
        className="
          text-[32px] sm:text-[36px] lg:text-[42px]
          font-bold text-gray-900
          tracking-[-0.02em]
          leading-[1.2]
          mb-4
        "
      >
        {t.language.titles}
      </h1>

      <p
        className="
          text-[16px] sm:text-[17px] lg:text-[18px]
          text-gray-500
          leading-[1.6]
          mb-12
          max-w-xl mx-auto
        "
      >
        {t.language.description}
      </p>
    </div>
  );
}