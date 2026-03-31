"use client";

import React from "react";
import { useLanguage } from "@/features/context/LanguageContext";

const SecurityContent: React.FC = () => {
  const { t } = useLanguage();

  const formattedDate = new Date().toLocaleDateString(
    t.securitypage.locale || "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <main className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-[100px] sm:pb-[120px]">

      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
          {t.securitypage.title}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          {t.securitypage.lastUpdated}: {formattedDate}
        </p>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 lg:p-12 border border-gray-200 shadow-sm space-y-8">

        {/* 1 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            {t.securitypage.section1Title}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            {t.securitypage.section1Desc}
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            {t.securitypage.section2Title}
          </h2>
          <ul className="ml-5 list-disc space-y-2">
            <li className="text-sm sm:text-base text-gray-600">
              {t.securitypage.measure1}
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              {t.securitypage.measure2}
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              {t.securitypage.measure3}
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              {t.securitypage.measure4}
            </li>
          </ul>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            {t.securitypage.section3Title}
          </h2>
          <ul className="ml-5 list-disc space-y-2">
            <li className="text-sm sm:text-base text-gray-600">
              {t.securitypage.account1}
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              {t.securitypage.account2}
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              {t.securitypage.account3}
            </li>
          </ul>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            {t.securitypage.section4Title}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            {t.securitypage.section4Desc}
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            {t.securitypage.section5Title}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            {t.securitypage.section5Desc}
          </p>
        </section>

      </div>
    </main>
  );
};

export default SecurityContent;