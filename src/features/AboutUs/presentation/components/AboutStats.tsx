import CommonCard from "@/components/common/CommonCards";
import { useLanguage } from "@/features/context/LanguageContext";
import { getaboutstats } from "../data/aboutstats";

export default function AboutStats() {
  const { t, isRTLOrder } = useLanguage();

  const stats = getaboutstats(t);

  return (
    <CommonCard
      type="darkblue"
      
      className="rounded-3xl p-8 sm:p-12 mb-12 text-white"
    >
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center"
      dir={isRTLOrder?"rtl":""}
      >
        {stats.map((stat, index) => (
          <div key={index}>
            <h4
              dir="ltr"
              className="text-3xl sm:text-4xl font-bold"
            >
              {stat.value}
            </h4>

            <p className="text-sm sm:text-base opacity-90">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </CommonCard>
  );
}