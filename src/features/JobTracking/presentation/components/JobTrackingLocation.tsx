export default function JobTrackingLocation() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      {/* Map Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-gray-900">Live Location</h3>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
          <svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          15 min away
        </div>
      </div>

      {/* Map */}
      <div className="relative w-full h-48 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl overflow-hidden flex items-center justify-center">
        {/* Provider Pin */}
        <div className="absolute top-1/3 left-2/5 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        {/* Your Location Pin */}
        <div className="absolute w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-md animate-bounce">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
