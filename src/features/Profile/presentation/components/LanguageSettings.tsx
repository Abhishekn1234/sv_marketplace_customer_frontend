"use client";

import { useAuthStore } from "@/features/core/store/auth"

export default function LanguageSettings() {
  const language = useAuthStore((state) => state.language);
  const setLanguage = useAuthStore((state) => state.setLanguage);

  const languages = [
    { code: "EN", label: "English" },
    { code: "HI", label: "Hindi" },
    { code: "AR", label: "Arabic" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617] px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
        
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6">
          Select Language
        </h2>

        <div className="space-y-4">
          {languages.map((lang) => {
            const isActive = language === lang.code;

            return (
              <label
                key={lang.code}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl cursor-pointer transition-all duration-300 border
                ${
                  isActive
                    ? "border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 text-white shadow-lg"
                    : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                {/* Left */}
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="language"
                    value={lang.code}
                    checked={isActive}
                    onChange={() => setLanguage(lang.code)}
                    className="accent-pink-500 w-5 h-5"
                  />
                  <span className="text-base sm:text-lg font-semibold">
                    {lang.label}
                  </span>
                </div>

                {/* Code Badge */}
                <span
                  className={`text-xs sm:text-sm px-3 py-1 rounded-full font-bold ${
                    isActive
                      ? "bg-black/30 text-white"
                      : "bg-white/10 text-gray-400"
                  }`}
                >
                  {lang.code}
                </span>
              </label>
            );
          })}
        </div>

        <p className="text-center text-gray-400 text-xs sm:text-sm mt-6">
          Your preference is saved automatically
        </p>
      </div>
    </div>
  );
}
