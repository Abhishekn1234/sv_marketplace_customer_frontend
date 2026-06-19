"use client";

import { useLanguage } from "@/features/context/LanguageContext";
import { Label, Radio } from "@/components/input";
import { useAuthStore } from "@/features/core/store/auth";
import CommonCard from "@/components/common/CommonCards";
import { toast } from "react-toastify";
import { languages } from "@/components/common/languages";

export default function LanguageSettings() {
  const language = useAuthStore((state) => state.language);
  const setLanguage = useAuthStore((state) => state.setLanguage);
  const { t } = useLanguage();

 
  const handleChange = (code: string, label: string) => {
    setLanguage(code);
    toast.success(`Language changed to ${label}`);
  };

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="w-full max-w-md">

        <CommonCard className="p-6">

          {/* HEADER */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 text-lg">
              🌐
            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              {t.profilepage.selectLanguage}
            </h2>
          </div>

          {/* LIST */}
          <div className="space-y-3">

            {languages.map((lang) => {
              const isActive = language === lang.code;

              return (
                <Label
                  key={lang.code}
                  className={`
                    flex items-center justify-between
                    p-4 rounded-xl cursor-pointer
                    border transition-all duration-200

                    ${
                      isActive
                        ? "border-blue-500 bg-blue-600 text-white shadow-md"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }
                  `}
                >
                  {/* LEFT SIDE (radio + label + code same line) */}
                  <div className="flex items-center gap-3">
                    <Radio
                      name="language"
                      value={lang.code}
                      checked={isActive}
                      onChange={() => handleChange(lang.code, lang.label)}
                    />

                    <div className="flex items-center gap-2">
                      <span className="font-medium text-base">
                        {lang.label}
                      </span>

                      <span
                        className={`
                          text-xs px-2 py-0.5 rounded-full font-semibold
                          ${
                            isActive
                              ? "bg-black/20 text-white"
                              : "bg-gray-200 text-gray-700"
                          }
                        `}
                      >
                        {lang.code}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT CHECK STATE */}
                  {isActive && (
                    <span className="text-sm font-semibold text-white">
                      Selected
                    </span>
                  )}
                </Label>
              );
            })}

          </div>

        </CommonCard>
      </div>
    </div>
  );
}