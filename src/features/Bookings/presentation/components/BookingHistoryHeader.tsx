import { useLanguage } from "@/features/context/LanguageContext";

export default function BookingHistoryHeader() {
  const{t}=useLanguage();
  return (
    <div className="mb-8 sm:mb-10 lg:mb-12">
      <h1
        className="
        text-2xl
        sm:text-3xl
        lg:text-4xl
        font-bold
        text-gray-900
        leading-tight
        tracking-tight
      "
      >
       {t.Bookingspage.title}
      </h1>

      <p
        className="
        mt-2
        text-sm
        sm:text-base
        text-gray-500
        font-medium
        max-w-xl
      "
      >
        {t.Bookingspage.subtitle}
      </p>
    </div>
  );
}