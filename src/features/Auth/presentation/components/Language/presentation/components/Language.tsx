import { useState, useEffect } from "react";
import LanguageCards from "./LanguageCards";
import LanguageHeader from "./LanguageHeader";
import LanguageBadge from "./LanguageBadge";
import LanguageFooter from "./LanguageFooter";

import { useLang } from "../hooks/useLang";
import { useAuthStore } from "@/features/core/store/auth";

export default function Language() {
  const { language, setLanguage: saveLanguage, loading } = useLang();

  // Zustand
  const setAppLanguage = useAuthStore(
    (state) => state.setLanguage
  );

  const [selectedLanguage, setSelectedLanguage] =
    useState<string | null>(null);

  useEffect(() => {
    if (language) {
      setSelectedLanguage(language);
    }
  }, [language]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <LanguageBadge />
      <LanguageHeader />
      <LanguageCards
        selectedLanguage={selectedLanguage}
        onSelectLanguage={(lang) => {
          setSelectedLanguage(lang);
          setAppLanguage(lang);
        }}
      />

      <LanguageFooter
        selectedLanguage={selectedLanguage}
        onContinue={async () => {
          if (!selectedLanguage) return;

          // API / backend save
          await saveLanguage(
            selectedLanguage as "en" | "hi" | "ar"
          );

          // Zustand update
          setAppLanguage(selectedLanguage);
        }}
      />
    </div>
  );
}