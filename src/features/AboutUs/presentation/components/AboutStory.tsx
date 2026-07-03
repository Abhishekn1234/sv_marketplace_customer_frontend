import { useLanguage } from "@/features/context/LanguageContext";
import CommonCard from "@/components/common/CommonCards";

export default function AboutStory() {
  const { t, isRTLOrder } = useLanguage();

  return (
    <CommonCard
      className="mb-8 border-2 border-gray-200 shadow-sm"
      contentClassName={`p-12 ${
        isRTLOrder ? "text-right" : "text-left"
      }`}
      forceRTL={isRTLOrder}
      forceLTR={!isRTLOrder}
    >
      {/* Heading */}
      <h2 className="mb-5 text-[28px] font-bold text-gray-900">
        {t.aboutpage.story.title}
      </h2>

      {/* Paragraphs */}
      <div className="space-y-4 text-[16px] leading-[1.8] text-gray-600">
        <p>{t.aboutpage.story.p1}</p>
        <p>{t.aboutpage.story.p2}</p>
        <p>{t.aboutpage.story.p3}</p>
      </div>
    </CommonCard>
  );
}