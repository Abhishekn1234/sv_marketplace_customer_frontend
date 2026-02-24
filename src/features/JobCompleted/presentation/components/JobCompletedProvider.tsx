



export default function JobCompletedProvider() {
  return (
    <div className="bg-white rounded-[20px] p-6 border border-gray-200">
      
      {/* Header */}
      <h2 className="text-base font-bold text-gray-900 mb-5">
        Your Professional
      </h2>

      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-5">
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
          alt="Provider"
          className="w-[72px] h-[72px] rounded-[18px] object-cover border-[3px] border-gray-100"
        />

        <div className="flex-1">
          
          {/* Name + Verified */}
          <div className="flex items-center gap-2 text-[18px] font-bold text-gray-900 mb-1">
            Mike Johnson

            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-3 h-3 fill-white"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-yellow-500 text-sm font-semibold mb-1">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 fill-yellow-500"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            4.9 (127 reviews)
          </div>

          {/* Meta */}
          <div className="text-sm text-gray-500">
            Plumbing Expert • 5 years experience
          </div>
        </div>
      </div>

      {/* Rate Section */}
      <div className="bg-blue-50 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-700 mb-3 font-medium">
          How was your service with Mike?
        </p>

        <button className="w-full h-12 rounded-xl bg-blue-600 text-white text-[15px] font-semibold flex items-center justify-center transition-all duration-200 active:scale-95 hover:bg-blue-700 hover:-translate-y-[1px] shadow-md">
          Rate Your Experience
        </button>
      </div>
    </div>
  );
}
