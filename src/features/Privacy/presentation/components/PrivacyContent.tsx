"use client";

import React from "react";
import { useLanguage } from "@/features/context/LanguageContext";
import { formatDate } from "@/components/utils/formatdate";


const PrivacyContent: React.FC = () => {
  const { t ,isRTLOrder} = useLanguage();

   const formattedHelpDate = formatDate(undefined,t);

  return (
    <main className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-[100px] sm:pb-[120px]" dir={isRTLOrder?"rtl":""}>
      
      {/* Header */}
      <div className="mb-8 sm:mb-12" dir={isRTLOrder?"text-right":"text-center"}>
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
          {t.privacy.title}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          {t.privacy.lastUpdated}: {formattedHelpDate}
        </p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 lg:p-12 border border-gray-200 shadow-sm space-y-8">

        {/* 1 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            {t.privacy.introTitle}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {t.privacy.introDesc}
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            {t.privacy.dataTitle}
          </h2>

          <h3 className="text-base sm:text-lg font-semibold mt-4 mb-2">
            {t.privacy.personalInfo}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {t.privacy.personalDesc}
          </p>

          <ul className="ml-5 list-disc space-y-2 text-gray-600">
            <li>{t.privacy.identity}</li>
            <li>{t.privacy.contact}</li>
            <li>{t.privacy.financial}</li>
            <li>{t.privacy.transaction}</li>
            <li>{t.privacy.technical}</li>
            <li>{t.privacy.profile}</li>
            <li>{t.privacy.usage}</li>
            <li>{t.privacy.marketing}</li>
          </ul>

          <h3 className="text-base sm:text-lg font-semibold mt-6 mb-2">
            {t.privacy.providerInfo}
          </h3>

          <ul className="ml-5 list-disc space-y-2 text-gray-600">
            <li>{t.privacy.credentials}</li>
            <li>{t.privacy.backgroundCheck}</li>
            <li>{t.privacy.insurance}</li>
            <li>{t.privacy.history}</li>
            <li>{t.privacy.tax}</li>
          </ul>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-3">
            {t.privacy.usageTitle}
          </h2>
          <ul className="ml-5 list-disc space-y-2 text-gray-600">
            <li>{t.privacy.use1}</li>
            <li>{t.privacy.use2}</li>
            <li>{t.privacy.use3}</li>
            <li>{t.privacy.use4}</li>
            <li>{t.privacy.use5}</li>
          </ul>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-3">
            {t.privacy.securityTitle}
          </h2>
          <p className="text-gray-600">
            {t.privacy.securityDesc}
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-3">
            {t.privacy.retentionTitle}
          </h2>
          <p className="text-gray-600">
            {t.privacy.retentionDesc}
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-3">
            {t.privacy.rightsTitle}
          </h2>
          <ul className="ml-5 list-disc space-y-2 text-gray-600">
            <li>{t.privacy.access}</li>
            <li>{t.privacy.correction}</li>
            <li>{t.privacy.erasure}</li>
            <li>{t.privacy.restriction}</li>
            <li>{t.privacy.portability}</li>
          </ul>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-3">
            {t.privacy.thirdPartyTitle}
          </h2>
          <p className="text-gray-600">
            {t.privacy.thirdPartyDesc}
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-3">
            {t.privacy.cookiesTitle}
          </h2>
          <p className="text-gray-600">
            {t.privacy.cookiesDesc}
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-3">
            {t.privacy.changesTitle}
          </h2>
          <p className="text-gray-600">
            {t.privacy.changesDesc}
          </p>
        </section>

        {/* 10 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-3">
            {t.privacy.contactTitle}
          </h2>
          <ul className="ml-5 list-disc space-y-2 text-gray-600">
            <li>{t.privacy.email}: privacy@homeease.com</li>
            <li>{t.privacy.phone}: 1-800-HOME-EASE</li>
            <li>{t.privacy.address}: 123 Service Street, San Francisco, CA 94105</li>
          </ul>
        </section>

      </div>
    </main>
  );
};

export default PrivacyContent;