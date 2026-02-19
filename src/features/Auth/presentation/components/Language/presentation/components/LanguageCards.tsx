

import { useState, useEffect } from "react";

interface LanguageCardsProps {
  selectedLanguage: string | null;
  onSelectLanguage: (code: string) => void; 
}

const languages = [
  { code: "en", native: "English", label: "English" },
  { code: "ar", native: "العربية", label: "Arabic" },
  { code: "hi", native: "हिन्दी", label: "Hindi" },
];

const LanguageIcon = ({ code }: { code: string }) => {
  switch (code) {
    case "en":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      );
    case "ar":
    case "hi":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
          <circle cx="12" cy="12" r="10" />
          <path d="M5 8l6 6" />
          <path d="M4 14l4-4" />
          <path d="M12 13v7" />
          <path d="M9 16h6" />
          <path d="M19 6l-4 4" />
          <path d="M15 10l4-4" />
        </svg>
      );
    default:
      return null;
  }
};

export default function LanguageCards({ selectedLanguage, onSelectLanguage }: LanguageCardsProps) {
  const [currentSelection, setCurrentSelection] = useState<string | null>(selectedLanguage);

  useEffect(() => {
    setCurrentSelection(selectedLanguage);
  }, [selectedLanguage]);

  const handleSelect = (code: string) => {
    setCurrentSelection(code); 
    onSelectLanguage(code);    
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12 px-4">
      {languages.map((lang) => {
        const isSelected = currentSelection === lang.code;

        return (
          <label
            key={lang.code}
            className={`
              group relative cursor-pointer
              bg-white border-2 rounded-2xl px-6 py-10 text-center
              transition-all duration-300
              ${isSelected ? "border-primary-600 shadow-lg" : "border-gray-200 hover:border-primary-600"}
            `}
          >
            <input
              type="radio"
              name="language"
              value={lang.code}
              checked={isSelected}
              onChange={() => handleSelect(lang.code)}
              className="absolute top-4 right-4 w-5 h-5 accent-primary-600"
            />

            <div
              className={`
                w-20 h-20 mx-auto mb-6 rounded-2xl border
                flex items-center justify-center
                transition-all duration-300
                ${isSelected
                  ? "bg-primary-600 border-primary-600"
                  : "bg-gray-100 border-gray-200 group-hover:bg-primary-600 group-hover:border-primary-600"
                }
              `}
            >
              <span className={isSelected ? "text-white" : "text-gray-900 group-hover:text-white"}>
                <LanguageIcon code={lang.code} />
              </span>
            </div>

            <div className="text-2xl font-bold text-gray-900 mb-2">{lang.native}</div>
            <div className="text-xs font-semibold uppercase tracking-widest text-gray-400">{lang.label}</div>
          </label>
        );
      })}
    </div>
  );
}
