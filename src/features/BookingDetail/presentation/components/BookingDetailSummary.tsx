export default function BookingDetailSummary() {
  return (
    <div className="px-6 lg:px-8 pb-10">
      
      {/* Page Title */}
      <h1 className="text-[42px] font-bold text-gray-900 mb-10 tracking-[-0.02em]">
        Booking Details
      </h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-8">
        
        {/* Left Column */}
        <div>
          <div className="bg-white border-2 border-gray-200 rounded-[20px] p-6 transition-all duration-200 hover:border-blue-300">
            
            {/* Card Title */}
            <h2 className="text-xs font-bold uppercase tracking-[0.5px] text-gray-400 mb-4">
              Service Summary
            </h2>

            {/* Service Header Only */}
            <div className="flex items-start gap-4">
              
              {/* Icon */}
              <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-8 h-8 text-blue-600"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18" />
                  <path d="M15 3v18" />
                </svg>
              </div>

              {/* Title + Description */}
              <div>
                <h3 className="text-[20px] font-bold text-gray-900 mb-1.5">
                  Deep Home Cleaning
                </h3>
                <p className="text-sm text-gray-500 leading-[1.5]">
                  Full house cleaning, including kitchen, bathrooms, and living areas.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column Placeholder */}
        <div></div>

      </div>
    </div>
  );
}
