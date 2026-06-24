import { useLanguage } from "@/features/context/LanguageContext";
import { getAboutValues } from "../data/aboutvalues";
import CommonCard from "@/components/common/CommonCards";

export default function AboutValues() {
  const { t, isRTLOrder } = useLanguage();

  const values = getAboutValues(t);
  const displayValues = isRTLOrder ? [...values].reverse() : values;

  return (
    <section className="mb-8" dir={isRTLOrder ? "rtl" : "ltr"}>
      {/* Section Title */}
      <h2
        className={`text-[28px] font-bold text-gray-900 mb-8 ${
          isRTLOrder ? "text-right" : "text-center"
        }`}
      >
        {t.aboutpage.values.title}
      </h2>

      {/* Grid */}
      <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        {displayValues.map((value, index) => (
          <CommonCard
            key={index}
            type="white"
            className="rounded-[20px] border-2 border-gray-200 hover:border-blue-600 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >
            {/* Icon */}
            <div
              className={`mb-5 flex ${
                isRTLOrder ? "flex-row" : ""
              }`}
            >
              {value.icon}
            </div>

            {/* Title */}
            <h3 className="text-[20px] font-bold text-gray-900 mb-3">
              {value.title}
            </h3>

            {/* Description */}
            <p className="text-[14px] leading-[1.6] text-gray-500">
              {value.description}
            </p>
          </CommonCard>
        ))}
      </div>
    </section>
  );
}
