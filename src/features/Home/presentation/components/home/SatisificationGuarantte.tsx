
export default function SatisfactionGuarantee() {
  return (
    <div className="flex items-center gap-3.5 p-4 rounded-xl cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 bg-yellow-50 hover:bg-yellow-100 hover:shadow-lg">
      {/* Icon */}
      <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 hover:scale-110 bg-yellow-100">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-5.5 h-5.5 text-yellow-600"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold uppercase tracking-wide mb-0.5 text-yellow-600">
          Satisfaction Guarantee
        </div>
        <div className="text-sm text-gray-500">
          Money back if not happy
        </div>
      </div>
    </div>
  );
}
