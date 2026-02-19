export function JobProgressProgress() {
  return (
    <div className="bg-white rounded-[20px] p-7 border border-gray-200 shadow-sm">
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[18px] font-bold text-gray-900">
          Overall Progress
        </h2>

        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-[13px] font-semibold rounded-full">
          <svg
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="w-4 h-4 animate-spin"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
          Working
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm font-medium mb-2">
          <span className="text-gray-500">Task Completion</span>
          <span className="text-blue-600 font-semibold">65%</span>
        </div>

        <div className="h-3 bg-gray-100 rounded-md overflow-hidden">
          <div className="h-full w-[65%] bg-gradient-to-r from-blue-600 to-blue-500 rounded-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
        <svg
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="w-4 h-4 text-blue-600"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        Started at 11:15 AM • Est. completion: 12:30 PM
      </div>
    </div>
  );
}
