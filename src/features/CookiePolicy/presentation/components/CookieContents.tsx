import React from "react";

const CookiePolicyContent: React.FC = () => {
  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-[100px] sm:pb-[120px]">
      
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
          Cookie Policy
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Last updated: {formattedDate}
        </p>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 lg:p-12 border border-gray-200 shadow-sm space-y-8">

        {/* 1 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            1. What Are Cookies?
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            Cookies are small text files placed on your device when you visit a
            website. They help websites function properly, improve user
            experience, and provide analytical information.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            2. How We Use Cookies
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600 mb-3">
            We use cookies to:
          </p>

          <ul className="ml-5 list-disc space-y-2">
            <li className="text-sm sm:text-base text-gray-600">
              Enable core website functionality
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              Improve performance and speed
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              Analyze traffic and usage patterns
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              Remember user preferences
            </li>
          </ul>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            3. Types of Cookies We Use
          </h2>

          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mt-4 mb-2">
            3.1 Essential Cookies
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            Required for the website to function properly. These cannot be
            disabled.
          </p>

          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mt-6 mb-2">
            3.2 Performance Cookies
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            Help us understand how visitors interact with our website.
          </p>

          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mt-6 mb-2">
            3.3 Functional Cookies
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            Allow us to remember your preferences and provide enhanced features.
          </p>

          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mt-6 mb-2">
            3.4 Marketing Cookies
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            Used to deliver relevant advertisements and track campaign
            effectiveness.
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            4. Third-Party Cookies
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            Some cookies may be set by third-party services that appear on our
            pages, such as analytics providers or payment processors.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            5. Managing Cookies
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            You can manage or disable cookies through your browser settings.
            However, disabling certain cookies may affect the functionality of
            the website.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            6. Changes to This Policy
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            We may update this Cookie Policy from time to time. Any changes will
            be reflected by updating the “Last updated” date above.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            7. Contact Us
          </h2>
          <ul className="ml-5 list-disc space-y-2">
            <li className="text-sm sm:text-base text-gray-600">
              Email: support@homeease.com
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              Phone: 1-800-HOME-EASE
            </li>
          </ul>
        </section>

      </div>
    </main>
  );
};

export default CookiePolicyContent;