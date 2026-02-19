import React from "react";

const PrivacyContent: React.FC = () => {
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
          Privacy Policy
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
            1. Introduction
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            Welcome to HomeEase. We respect your privacy and are committed to
            protecting your personal data. This privacy policy will inform you
            about how we look after your personal data when you visit our website
            or use our services and tell you about your privacy rights and how the
            law protects you.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            2. Data We Collect
          </h2>

          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mt-4 mb-2">
            2.1 Personal Information
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600 mb-3">
            We may collect, use, store and transfer different kinds of personal
            data about you:
          </p>

          <ul className="ml-5 list-disc space-y-2">
            <li className="text-sm sm:text-base text-gray-600">Identity Data</li>
            <li className="text-sm sm:text-base text-gray-600">Contact Data</li>
            <li className="text-sm sm:text-base text-gray-600">Financial Data</li>
            <li className="text-sm sm:text-base text-gray-600">Transaction Data</li>
            <li className="text-sm sm:text-base text-gray-600">Technical Data</li>
            <li className="text-sm sm:text-base text-gray-600">Profile Data</li>
            <li className="text-sm sm:text-base text-gray-600">Usage Data</li>
            <li className="text-sm sm:text-base text-gray-600">
              Marketing and Communications Data
            </li>
          </ul>

          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mt-6 mb-2">
            2.2 Service Provider Information
          </h3>

          <ul className="ml-5 list-disc space-y-2">
            <li className="text-sm sm:text-base text-gray-600">
              Professional credentials and certifications
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              Background check information
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              Insurance and bonding documentation
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              Service history and ratings
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              Tax information for payment processing
            </li>
          </ul>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            3. How We Use Your Data
          </h2>

          <ul className="ml-5 list-disc space-y-2">
            <li className="text-sm sm:text-base text-gray-600">
              Register you as a customer or service provider
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              Process and deliver your service orders
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              Manage our relationship with you
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              Administer and protect our business
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              Improve website and services
            </li>
          </ul>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            4. Data Security
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            We have implemented appropriate security measures to prevent your
            personal data from being accidentally lost, used, accessed,
            altered, or disclosed without authorization.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            5. Data Retention
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            We retain your personal data only as long as necessary for legal,
            regulatory, and business purposes.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            6. Your Legal Rights
          </h2>
          <ul className="ml-5 list-disc space-y-2">
            <li className="text-sm sm:text-base text-gray-600">Access</li>
            <li className="text-sm sm:text-base text-gray-600">Correction</li>
            <li className="text-sm sm:text-base text-gray-600">Erasure</li>
            <li className="text-sm sm:text-base text-gray-600">Restriction</li>
            <li className="text-sm sm:text-base text-gray-600">Data portability</li>
          </ul>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            7. Third-Party Links
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            Our website may include links to third-party websites. We are not
            responsible for their privacy practices.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            8. Cookies
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            We use cookies to improve your browsing experience and analyze site
            traffic.
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            9. Changes to This Policy
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            We may update this policy periodically and will update the “Last
            updated” date accordingly.
          </p>
        </section>

        {/* 10 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            10. Contact Us
          </h2>
          <ul className="ml-5 list-disc space-y-2">
            <li className="text-sm sm:text-base text-gray-600">
              Email: privacy@homeease.com
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              Phone: 1-800-HOME-EASE
            </li>
            <li className="text-sm sm:text-base text-gray-600">
              Address: 123 Service Street, San Francisco, CA 94105
            </li>
          </ul>
        </section>

      </div>
    </main>
  );
};

export default PrivacyContent;
