import React, { createContext, useContext, useMemo, useEffect } from "react";

import en from "./languagejson/en.json";
import hi from "./languagejson/hi.json";
import ar from "./languagejson/ar.json";

import type { TranslationType } from "./types/language";
import { useAuthStore } from "@/features/core/store/auth";

const languagesMap = {
  en,
  hi,
  ar,
} as const;

type SupportedLang = keyof typeof languagesMap;

interface LanguageContextValue {
  t: TranslationType;
  lang: SupportedLang;
  isRTLOrder: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const storeLang = useAuthStore((state) => state.language);

  const lang: SupportedLang = useMemo(() => {
    const normalized = (storeLang || "en").toLowerCase();

    if (normalized === "en" || normalized === "hi" || normalized === "ar") {
      return normalized;
    }

    return "en";
  }, [storeLang]);

  /**
   * TRUE RTL ORDER MODE (NOT browser RTL)
   */
  const isRTLOrder = lang === "ar";

  /**
   * GLOBAL ORDER CONTROL (IMPORTANT PART)
   */
  useEffect(() => {
    const root = document.documentElement;

    if (isRTLOrder) {
      root.classList.add("rtl-order");
    } else {
      root.classList.remove("rtl-order");
    }
  }, [isRTLOrder]);

  const value = useMemo(
    () => ({
      lang,
      t: languagesMap[lang],
      isRTLOrder,
    }),
    [lang, isRTLOrder]
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
    return {
      lang: "en" as SupportedLang,
      t: languagesMap.en,
      isRTLOrder: false,
    };
  }

  return context;
};