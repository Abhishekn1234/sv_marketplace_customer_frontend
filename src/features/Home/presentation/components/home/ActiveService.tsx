

export default function ActiveService() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 overflow-hidden relative transition-all duration-300 hover:shadow-lg hover:border-blue-500 hover:-translate-y-0.5">
      {/* Service Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="relative w-2.5 h-2.5 bg-green-500 rounded-full">
            <span className="absolute -inset-1 bg-green-500 rounded-full opacity-40 animate-pulse"></span>
          </span>
          <span className="text-gray-900 font-semibold text-lg">Deep Cleaning</span>
          <span className="px-3 py-1 text-green-700 bg-green-100 border border-green-200 rounded-full text-xs font-semibold uppercase tracking-wider">
            In Progress
          </span>
        </div>
        <span className="text-blue-600 font-semibold text-base tabular-nums">65%</span>
      </div>

      {/* Provider Info */}
      <div className="flex items-center gap-3.5 mb-4">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
          alt="Maria R."
          className="w-13 h-13 rounded-lg border-2 border-gray-100 object-cover transition-transform duration-200 hover:scale-105"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-gray-900 font-semibold text-base">
            Maria R.
            <span className="flex items-center gap-1 text-yellow-400 font-semibold text-sm" aria-label="Rating 4.9">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              4.9
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-sm mt-0.5">
            <span className="flex items-center gap-1">
              Verified Pro
              <span className="w-4.5 h-4.5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </span>
              • 5 yrs exp
            </span>
          </div>
        </div>
      </div>

      {/* Arrival Text */}
      <p className="text-gray-500 text-sm font-medium mb-2">
        <span className="text-blue-600 font-semibold">Maria arrives in 12 mins</span>
      </p>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-5 relative" aria-label="Progress 65%">
        <div className="h-full w-[65%] bg-gradient-to-r from-blue-500 to-blue-600 rounded-full relative overflow-hidden transition-all duration-1000 ease-in-out">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="flex-1 h-12 cursor-pointer rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-md hover:bg-blue-700 hover:-translate-y-0.5 transition-transform duration-200 active:scale-95">
          Track
        </button>
        <button className="flex-1 h-12 cursor-pointer rounded-xl bg-white border border-blue-100 text-blue-600 font-semibold text-sm hover:bg-blue-50 hover:border-blue-500 hover:-translate-y-0.5 transition-transform duration-200 active:scale-95">
          Chat
        </button>
      </div>
    </div>
  );
}
