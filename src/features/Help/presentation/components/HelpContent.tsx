import React from "react";

const HelpContent: React.FC = () => {
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
          Help & Support
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Last updated: {formattedDate}
        </p>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 lg:p-12 border border-gray-200 shadow-sm space-y-8">

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            1. Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            Visit our FAQ section to find answers to common questions about
            bookings, payments, cancellations, and account management.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            2. Contact Support
          </h2>
          <ul className="ml-5 list-disc space-y-2">
            <li className="text-sm sm:text-base text-gray-600">
              Email: support@homeease.com
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              Phone: 1-800-HOME-EASE
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              Live Chat available 24/7
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            3. Service Issues
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            If you experience any issue with a service provider, please report
            it through your dashboard so we can review and resolve it quickly.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            4. Feedback & Suggestions
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            We value your feedback. Share suggestions to help us improve the
            HomeEase experience for everyone.
          </p>
        </section>

      </div>
    </main>
  );
};

export default HelpContent;