const features = [
  { text: "Vetted Experts" },
  { text: "Service Guarantee" },
  { text: "24/7 Support" },
];

export default function BookingDetailFooter() {
  return (
    <footer className="mt-10 bg-white/50 border-t border-gray-200 p-10 md:p-8 sm:p-6">
      {/* Features */}
      <div className="flex justify-center items-center gap-12 mb-6 flex-wrap sm:flex-col lg:flex-row sm:gap-5">
        {features.map((feature, index) => (
          <div key={feature.text} className="flex items-center gap-2 text-gray-500 uppercase font-bold text-xs">
            {/* Checkmark SVG */}
            <svg
              className="w-5 h-5 text-yellow-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            {feature.text}

            {/* Divider except for last item */}
            {index < features.length - 1 && <div className="w-px h-4 bg-gray-200 mx-4"></div>}
          </div>
        ))}
      </div>

      {/* Copyright */}
      <p className="text-center text-xs text-gray-400 font-medium tracking-wide">
        © 2024 HomeEase Premium Services Inc. All rights reserved.
      </p>
    </footer>
  );
}
