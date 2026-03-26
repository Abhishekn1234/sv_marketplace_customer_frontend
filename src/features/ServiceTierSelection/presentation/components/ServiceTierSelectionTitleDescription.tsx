import { useLanguage } from "@/features/context/LanguageContext";

export default function ServiceTierSelectionTitleDescription() {
  const {t}=useLanguage();
  const title = t.servicetierselectionpage.title;
    const words = title.split(" ");
    const lastWord = words.pop();
  return (
    <div className="text-center mb-12 px-6">
      {/* Title */}
     

      <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-gray-900 mb-4 tracking-tight">
        {words.join(" ")}{" "}
        <span className="text-blue-500">{lastWord}</span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
       {t.servicetierselectionpage.description}
      </p>
    </div>
  );
}
