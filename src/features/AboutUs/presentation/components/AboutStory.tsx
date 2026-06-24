import { useLanguage } from "@/features/context/LanguageContext";

export default function AboutStory() {
  const { t, isRTLOrder } = useLanguage();

  return (
    <section
      dir={isRTLOrder ? "rtl" : "ltr"}
      className={`bg-white rounded-[20px] border-2 border-gray-200 p-12 mb-8 shadow-sm ${
        isRTLOrder ? "text-right" : "text-left"
      }`}
    >
      {/* Heading */}
      <h2 className="text-[28px] font-bold text-gray-900 mb-5">
        {t.aboutpage.story.title}
      </h2>

      {/* Paragraphs */}
      <div className="space-y-4 text-[16px] leading-[1.8] text-gray-600">
        <p>{t.aboutpage.story.p1}</p>

        <p>{t.aboutpage.story.p2}</p>

        <p>{t.aboutpage.story.p3}</p>
      </div>
    </section>
  );
}
