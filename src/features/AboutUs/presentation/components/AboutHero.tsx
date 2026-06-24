import { useLanguage } from "@/features/context/LanguageContext";

export default function AboutHero() {
  const {t,isRTLOrder}=useLanguage();
  return (
          <div
        dir={isRTLOrder ? "rtl" : "ltr"}
        className={`mb-12 ${
          isRTLOrder ? "text-right" : "text-center"
        }`}
      >
      
      {/* Title */}
      <h1 className="text-[42px] font-bold text-gray-900 mb-4 tracking-[-0.02em]">
       {t.aboutpage.hero.title}
      </h1>

      {/* Subtitle */}
      <p className="text-[18px] text-gray-500 leading-relaxed max-w-7xl">
        {t.aboutpage.hero.subtitle}
      </p>

    </div>
  );
}

