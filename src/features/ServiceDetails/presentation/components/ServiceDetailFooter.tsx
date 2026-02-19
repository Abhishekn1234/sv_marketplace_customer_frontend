import React from "react";

export default function ServiceDetailFooter() {
  const features = [
    { label: "Vetted Experts" },
    { label: "Service Guarantee" },
    { label: "24/7 Support" },
  ];

  return (
    <footer className="mt-8 border-t border-gray-200 bg-white/50 px-8 py-10">
      {/* Features */}
      <div className="flex flex-wrap justify-center items-center gap-12 mb-6">
        {features.map((feature, idx) => (
          <React.Fragment key={feature.label}>
            <div className="flex items-center gap-2 text-gray-500 uppercase text-xs font-bold tracking-wide">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-5 h-5 text-yellow-500"
              >
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>{feature.label}</span>
            </div>
            {idx !== features.length - 1 && (
              <div className="w-px h-4 bg-gray-200"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Copyright */}
      <p className="text-center text-gray-400 text-xs font-medium tracking-wide">
        © 2024 HomeEase Premium Services Inc. All rights reserved.
      </p>
    </footer>
  );
}
