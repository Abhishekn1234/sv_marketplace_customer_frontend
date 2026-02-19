export default function ServiceTierSelectionFooter() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Features */}
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-6 md:gap-12 mb-8 text-center md:text-left">
          
          {/* Feature 1 */}
          <FeatureItem text="Vetted Experts" />

          {/* Divider */}
          <div className="hidden md:block w-px h-4 bg-gray-200" />

          {/* Feature 2 */}
          <FeatureItem text="Service Guarantee" />

          {/* Divider */}
          <div className="hidden md:block w-px h-4 bg-gray-200" />

          {/* Feature 3 */}
          <FeatureItem text="24/7 Support" />
        </div>

        {/* Copyright */}
        <p className="text-center text-xs text-gray-400 font-medium tracking-wide">
          © {new Date().getFullYear()} HomeEase Premium Services Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

/* ================= REUSABLE FEATURE ================= */

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
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
      <span>{text}</span>
    </div>
  );
}
