import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
} from "react";

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
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const storeLang = useAuthStore((state) => state.language);

  /* ================= SAFE LANGUAGE RESOLUTION ================= */
  const lang: SupportedLang = useMemo(() => {
    const normalized = (storeLang || "en").toLowerCase();

    if (normalized === "en" || normalized === "hi" || normalized === "ar") {
      return normalized;
    }

    return "en";
  }, [storeLang]);

  /* ================= OPTIONAL RTL SUPPORT ================= */
  useEffect(() => {
    document.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  /* ================= CONTEXT VALUE (MEMOIZED) ================= */
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

/* ================= SAFE HOOK ================= */
export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    console.warn(
      "⚠️ LanguageProvider missing - returning fallback English translations"
    );

    return {
      lang: "en" as SupportedLang,
      t: languagesMap.en,
    };
  }

  return context;
};