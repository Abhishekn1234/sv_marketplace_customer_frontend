import type { LanguageCode } from "@/features/context/types/language";

export interface LanguageRepo {
  createLanguage: (code: LanguageCode) => Promise<LanguageCode>;
  getLanguage: () => Promise<LanguageCode>;
}