import React from "react";
import { useLanguage } from "@/features/context/LanguageContext";
import { formattedHelpDate } from "../utils/formatdateforhelp";
import CommonCard from "@/components/common/CommonCards";
const HelpContent: React.FC = () => {
  const { t, isRTLOrder } = useLanguage();

  return (
    <main
      dir={isRTLOrder ? "rtl" : "ltr"}
      className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-[100px] sm:pb-[120px]"
    >
      {/* Header */}
      <div
        className={`mb-8 sm:mb-12 ${
          isRTLOrder ? "text-right" : "text-center"
        }`}
      >
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
          {t.helppage.title}
        </h1>

        <p className="text-xs sm:text-sm text-gray-500">
          {t.helppage.lastUpdated}: {formattedHelpDate}
        </p>
      </div>

      {/* Content Card */}
      <div
        className={`bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 lg:p-12 border border-gray-200 shadow-sm space-y-8 ${
          isRTLOrder ? "text-right" : "text-left"
        }`}
      >
        {/* 1 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            {t.helppage.faqTitle}
          </h2>

          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            {t.helppage.faqDesc}
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            {t.helppage.contactTitle}
          </h2>

          <ul
            className={`list-disc space-y-2 ${
              isRTLOrder ? "pr-5" : "pl-5"
            }`}
          >
            <li className="text-sm sm:text-base text-gray-600">
              {t.helppage.email}: support@homeease.com
            </li>

            <li className="text-sm sm:text-base text-gray-600">
              {t.helppage.phone}: 1-800-HOME-EASE
            </li>

            <li className="text-sm sm:text-base text-gray-600">
              {t.helppage.chat}
            </li>
          </ul>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            {t.helppage.issueTitle}
          </h2>

          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            {t.helppage.issueDesc}
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            {t.helppage.feedbackTitle}
          </h2>

          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            {t.helppage.feedbackDesc}
          </p>
        </section>
      </div>
    </main>
  );
};

export default HelpContent;