import React, { createContext, useContext, useMemo } from "react";
import en from "./languagejson/en.json";
import hi from "./languagejson/hi.json";
import ar from "./languagejson/ar.json";
import type { TranslationType } from "./types/language";
import { useAuthStore } from "@/features/core/store/auth";

const languagesMap = {
  en,
  hi,
  ar,
};

type SupportedLang = keyof typeof languagesMap;

interface LanguageContextValue {
  t: TranslationType;
  lang: SupportedLang;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  
  const storeLang = useAuthStore((state) => state.language);


  const lang: SupportedLang = (storeLang in languagesMap
    ? storeLang
    : "en") as SupportedLang;

  const value = useMemo(
    () => ({
      lang,
      t: languagesMap[lang],
    }),
    [lang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
};


