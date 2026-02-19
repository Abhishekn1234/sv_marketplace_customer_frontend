export default function VerificationFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white/50 px-8 py-10">
      {/* FEATURES */}
      <div className="flex flex-wrap items-center justify-center gap-6 mb-6">

        {/* Feature 1 */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5 text-amber-500"
          >
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Secure Verification
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-4 bg-gray-200" />

        {/* Feature 2 */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5 text-amber-500"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Privacy Protected
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-4 bg-gray-200" />

        {/* Feature 3 */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5 text-amber-500"
          >
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          24/7 Support
        </div>
      </div>

      {/* COPYRIGHT */}
      <p className="text-center text-xs font-medium tracking-wide text-gray-400">
        © 2024 HomeEase Services Inc. All rights reserved.
      </p>
    </footer>
  );
}
