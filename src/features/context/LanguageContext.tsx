// LanguageContext.tsx
import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useEffect,
} from "react";

import en from "./languagejson/en.json";
import hi from "./languagejson/hi.json";
import ar from "./languagejson/ar.json";

import type { TranslationType } from "./types/language";
import { useAuthStore } from "@/features/core/store/auth";
import { LocalizedText } from "@/components/common/localizedtext.types";

const languagesMap = { en, hi, ar } as const;

type SupportedLang = keyof typeof languagesMap;

interface LanguageContextValue {
  t: TranslationType;
  lang: SupportedLang;
  isRTLOrder: boolean;
  localize: (value?: string | LocalizedText | null) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// Shared so both the provider and the no-provider fallback stay in sync.
function localizeValue(
  lang: SupportedLang,
  value?: string | LocalizedText | null
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.en || value.ar || value.hi || "";
}

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

  const isRTLOrder = lang === "ar";

  useEffect(() => {
    const root = document.documentElement;
    if (isRTLOrder) {
      root.classList.add("rtl-order");
    } else {
      root.classList.remove("rtl-order");
    }
  }, [isRTLOrder]);

  const localize = useCallback(
    (value?: string | LocalizedText | null) => localizeValue(lang, value),
    [lang]
  );

  const value = useMemo(
    () => ({
      lang,
      t: languagesMap[lang],
      isRTLOrder,
      localize,
    }),
    [lang, isRTLOrder, localize]
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
      localize: (value?: string | LocalizedText | null) =>
        localizeValue("en", value),
    };
  }

  return context;
};