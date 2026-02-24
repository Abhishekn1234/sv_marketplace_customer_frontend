import React from "react";

const SecurityContent: React.FC = () => {
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
          Security Policy
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Last updated: {formattedDate}
        </p>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 lg:p-12 border border-gray-200 shadow-sm space-y-8">

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            1. Our Commitment to Security
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            At HomeEase, protecting your data and ensuring platform security
            is our top priority. We implement strict technical and organizational
            measures to safeguard your information.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            2. Data Protection Measures
          </h2>
          <ul className="ml-5 list-disc space-y-2">
            <li className="text-sm sm:text-base text-gray-600">
              End-to-end encryption for sensitive data
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              Secure HTTPS communication
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              Regular security audits and monitoring
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              Role-based access control for internal systems
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            3. Account Security
          </h2>
          <ul className="ml-5 list-disc space-y-2">
            <li className="text-sm sm:text-base text-gray-600">
              Strong password requirements
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              Multi-factor authentication (if enabled)
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              Login activity monitoring
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            4. Payment Security
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            All transactions are processed through secure, PCI-compliant
            payment providers to ensure your financial data remains protected.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            5. Reporting Vulnerabilities
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            If you discover a potential security vulnerability, please contact
            us immediately at security@homeease.com so we can investigate and
            resolve the issue promptly.
          </p>
        </section>

      </div>
    </main>
  );
};

export default SecurityContent;