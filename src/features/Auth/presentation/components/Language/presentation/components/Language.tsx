import { useState } from "react";
import LanguageCards from "./LanguageCards";
import LanguageHeader from "./LanguageHeader";
import LanguageBadge from "./LanguageBadge";
import LanguageFooter from "./LanguageFooter";


import ProgressStepper from "../../../auth/Register/RegisterTab";

import { useLang } from "../hooks/useLang";
import Footer from "@/components/common/CommonFooter";
import CommonNavbar from "@/components/common/CommonNavbar";

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
      <CommonNavbar rightButton={{ label: "Sign In", to: "/login", variant: "primary" }}  />
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

      <Footer />
    </div>
  );
}
