"use client";

import { useAuthStore } from "@/features/core/store/auth";

export default function LanguageSettings() {
  const language = useAuthStore((state) => state.language);
  const setLanguage = useAuthStore((state) => state.setLanguage);

  const languages = [
    { code: "EN", label: "English" },
    { code: "HI", label: "Hindi" },
    { code: "AR", label: "Arabic" },
  ];

  return (
    <div className="flex justify-center mt-10 px-4">
      {/* Card Container */}
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-md border">
        
        <div className="flex items-center gap-3 mb-5">
                {/* Icon */}
                <div className="w-8 h-8 flex items-center justify-center rounded-lg  text-black text-sm">
                    🌐
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Select Language
                </h2>
                </div>

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
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
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

                <span
                  className={`text-xs sm:text-sm px-3 py-1 rounded-full font-bold ${
                    isActive
                      ? "bg-black/30 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {lang.code}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}