

export default function JobCompletedActions() {
  return (
    <div className="bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm w-full max-w-3xl mx-auto mt-5">
      
      {/* Title */}
      <h2 className="text-base font-bold text-gray-900 mb-4">
        What's Next?
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* Action Button */}
        <div className="group flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm">
          <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center border border-gray-200 transition-all duration-200 group-hover:bg-blue-50 group-hover:border-blue-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5 text-gray-500 transition-colors duration-200 group-hover:text-blue-600"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-900">
            View Invoice
          </span>
        </div>

        {/* Book Again */}
        <div className="group flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm">
          <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center border border-gray-200 transition-all duration-200 group-hover:bg-blue-50 group-hover:border-blue-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5 text-gray-500 transition-colors duration-200 group-hover:text-blue-600"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-900">
            Book Again
          </span>
        </div>

        {/* Support */}
        <div className="group flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm">
          <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center border border-gray-200 transition-all duration-200 group-hover:bg-blue-50 group-hover:border-blue-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5 text-gray-500 transition-colors duration-200 group-hover:text-blue-600"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-900">
            Get Support
          </span>
        </div>

        {/* Share */}
        <div className="group flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm">
          <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center border border-gray-200 transition-all duration-200 group-hover:bg-blue-50 group-hover:border-blue-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5 text-gray-500 transition-colors duration-200 group-hover:text-blue-600"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-900">
            Share
          </span>
        </div>

      </div>
    </div>
  );
}
