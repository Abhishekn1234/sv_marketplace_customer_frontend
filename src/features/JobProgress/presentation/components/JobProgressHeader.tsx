import { useLanguage } from "@/features/context/LanguageContext";

export default function JobProgressHeader() {
   const {t}=useLanguage();
  return (
    <div className="mb-8">
      <h1 className="text-[32px] font-bold text-gray-900 leading-[1.2] tracking-[-0.02em] mb-2">
        {t.jobprogresspage.title}
      </h1>
      <p className="text-[16px] text-gray-500 font-medium">
        {t.jobprogresspage.subtitle}
      </p>
    </div>
  );
}
