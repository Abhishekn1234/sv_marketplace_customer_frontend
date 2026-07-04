"use client";

import { useLanguage } from "@/features/context/LanguageContext";
import { RadioGroup } from "@/components/input";
import { useAuthStore } from "@/features/core/store/auth";
import CommonCard from "@/components/common/CommonCards";
import { toast } from "react-toastify";
import { languages } from "@/components/common/languages";

export default function LanguageSettings() {
  const language = useAuthStore((state) => state.language);
  const setLanguage = useAuthStore((state) => state.setLanguage);
  const { t } = useLanguage();

  const handleChange = (code: string) => {
    const selected = languages.find((lang) => lang.code === code);

    if (!selected) return;

    setLanguage(code);
    toast.success(`Language changed to ${selected.label}`);
  };

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="w-full max-w-md">
        <CommonCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 text-lg">
              🌐
            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              {t.profilepage.selectLanguage}
            </h2>
          </div>

          <RadioGroup
            name={t.language.title}
            value={language}
            onChange={handleChange}
            className="space-y-3"
            options={languages.map((lang) => ({
              label: `${lang.label} (${lang.code})`,
              value: lang.code,
            }))}
          />
        </CommonCard>
      </div>
    </div>
  );
}