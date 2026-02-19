import { useState } from "react";
import LanguageCards from "./LanguageCards";
import LanguageHeader from "./LanguageHeader";
import LanguageBadge from "./LanguageBadge";
import LanguageFooter from "./LanguageFooter";

import RegisterHeader from "@/features/Layout/RegisterHeader";
import ProgressStepper from "../../../auth/Register/RegisterTab";
import RegisterFooter from "../../../auth/Register/RegisterFooter";
import { useLang } from "../hooks/useLang";

export default function Language() {
  const { language, setLanguage: saveLanguage, loading } = useLang();

  // Local UI state for selected language (updates on click only)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(language || null);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="bg-gray-50">
      <RegisterHeader />
      <ProgressStepper />

      <LanguageBadge />
      <LanguageHeader />

    
      <LanguageCards
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
      />

    
      <LanguageFooter
        selectedLanguage={selectedLanguage}
        onContinue={async () => {
          if (!selectedLanguage) return;

          await saveLanguage(selectedLanguage as "en" | "hi" | "ar");
        }}
      />

      <RegisterFooter />
    </div>
  );
}
