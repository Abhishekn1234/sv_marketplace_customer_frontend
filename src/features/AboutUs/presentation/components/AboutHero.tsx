import { useLanguage } from "@/features/context/LanguageContext";

export default function AboutHero() {
  const {t}=useLanguage();
  return (
    <div className="text-center mb-12">
      
      {/* Title */}
      <h1 className="text-[42px] font-bold text-gray-900 mb-4 tracking-[-0.02em]">
       {t.aboutpage.hero.title}
      </h1>

      {/* Subtitle */}
      <p className="text-[18px] text-gray-500 leading-relaxed max-w-2xl mx-auto">
        {t.aboutpage.hero.subtitle}
      </p>

    </div>
  );
}

