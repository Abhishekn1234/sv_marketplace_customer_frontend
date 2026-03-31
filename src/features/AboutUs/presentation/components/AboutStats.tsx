import { useLanguage } from "@/features/context/LanguageContext";

export default function AboutStats() {
  const {t}=useLanguage();
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-3xl p-8 sm:p-12 mb-12">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        <div>
          <h4 className="text-3xl sm:text-4xl font-bold">50K+</h4>
          <p className="text-sm sm:text-base opacity-90">
            {t.aboutpage.stats.customers}
          </p>
        </div>
        <div>
          <h4 className="text-3xl sm:text-4xl font-bold">2,500+</h4>
          <p className="text-sm sm:text-base opacity-90">
            {t.aboutpage.stats.professionals}
          </p>
        </div>
        <div>
          <h4 className="text-3xl sm:text-4xl font-bold">4.9</h4>
          <p className="text-sm sm:text-base opacity-90">
           {t.aboutpage.stats.rating}
          </p>
        </div>
        <div>
          <h4 className="text-3xl sm:text-4xl font-bold">100K+</h4>
          <p className="text-sm sm:text-base opacity-90">
            {t.aboutpage.stats.services}
          </p>
        </div>
      </div>
    </section>
  );
}
