import { useLanguage } from "@/features/context/LanguageContext";

export default function AboutValues() {
  const {t}=useLanguage();
  const values = [
    {
      title: t.aboutpage.values.items.trust.title,
      description:
       t.aboutpage.values.items.trust.desc,
      icon: (
        <>
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </>
      ),
    },
    {
      title: t.aboutpage.values.items.quality.title,
      description:
       t.aboutpage.values.items.quality.desc,
      icon: (
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      ),
    },
    {
      title: t.aboutpage.values.items.customer.title,
      description:
        t.aboutpage.values.items.customer.desc,
      icon: (
        <>
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </>
      ),
    },
    {
      title: t.aboutpage.values.items.safety.title,
      description:
        t.aboutpage.values.items.safety.desc,
      icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    },
    {
      title: t.aboutpage.values.items.transparency.title,
      description:
        t.aboutpage.values.items.transparency.desc,
      icon: (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </>
      ),
    },
    {
      title: t.aboutpage.values.items.sustainability.title,
      description:
        t.aboutpage.values.items.sustainability.desc,
      icon: <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />,
    },
  ];

  return (
    <section className="mb-8">

      {/* Section Title */}
      <h2 className="text-[28px] font-bold text-gray-900 text-center mb-8">
        {t.aboutpage.values.title}
      </h2>

      {/* Grid */}
      <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        {values.map((value, index) => (
          <div
            key={index}
            className="bg-white rounded-[20px] p-8 border-2 border-gray-200 transition-all duration-300 hover:border-blue-600 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Icon */}
            <div className="w-14 h-14 bg-blue-50 rounded-[14px] flex items-center justify-center mb-5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-7 h-7 text-blue-600"
              >
                {value.icon}
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-[20px] font-bold text-gray-900 mb-3">
              {value.title}
            </h3>

            {/* Description */}
            <p className="text-[14px] leading-[1.6] text-gray-500">
              {value.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

