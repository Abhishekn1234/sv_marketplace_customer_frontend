export default function JobCompletedSummary() {
  return (
    <div className="bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-bold text-gray-900">
          Service Summary
        </h2>

        <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200">
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span className="text-sm font-semibold">Completed</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          ["Service Type", "Plumbing Repair"],
          ["Service Tier", "Standard"],
          ["Date", "January 31, 2026"],
          ["Duration", "1h 15min"],
        ].map(([label, value]) => (
          <div key={label} className="bg-gray-50 rounded-xl p-4">
            <div className="text-xs text-gray-500 font-medium mb-1">
              {label}
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {value}
            </div>
          </div>
        ))}

        <div className="bg-gray-50 rounded-xl p-4 sm:col-span-2">
          <div className="text-xs text-gray-500 font-medium mb-1">
            Address
          </div>
          <div className="text-sm font-semibold text-gray-900 leading-snug">
            123 Main Street, Apt 4B, Los Angeles, CA 90001
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-200 my-6"></div>

      <div className="flex justify-between items-center">
        <span className="text-base font-semibold text-gray-900">
          Total Paid
        </span>
        <span className="text-2xl font-bold text-emerald-600">
          $89.00
        </span>
      </div>
    </div>
  );
}