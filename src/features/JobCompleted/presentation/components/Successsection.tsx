import { useLanguage } from "@/features/context/LanguageContext";

export default function SuccessSection() {
  const {t}=useLanguage();
  return (
    <div className="text-center mb-10">
      {/* Icon */}
      <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#34d399] shadow-lg animate-scaleIn">
        <svg
          viewBox="0 0 24 24"
          className="w-12 h-12 text-white fill-current"
        >
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        {t.jobcompletedpage.title}!
      </h1>

      {/* Message */}
      <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
       {t.jobcompletedpage.message}!
      </p>

      {/* Tailwind animation */}
      <style>
        {`
          @keyframes scaleIn {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-scaleIn {
            animation: scaleIn 0.5s ease forwards;
          }
        `}
      </style>
    </div>
  );
}
