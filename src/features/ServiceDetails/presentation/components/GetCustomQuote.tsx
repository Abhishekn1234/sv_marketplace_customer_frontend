export default function CustomQuote() {
  return (
    <div className="group flex flex-col items-center justify-center text-center bg-white border-2 border-dashed border-gray-200 rounded-[20px] p-8 min-h-[280px] cursor-pointer transition-all duration-300 hover:border-blue-600 hover:bg-gray-50">
      
      {/* Icon */}
      <div className="w-16 h-16 flex items-center justify-center mb-4 bg-gray-50 border-2 border-gray-200 rounded-full transition-all duration-300 group-hover:bg-blue-600 group-hover:border-blue-600">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-7 h-7 text-gray-900 transition-colors duration-300 group-hover:text-white"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>

      {/* Title */}
      <h3 className="text-[20px] font-bold text-gray-900 mb-2">
        Custom Request
      </h3>

      {/* Description */}
      <p className="text-[14px] text-gray-500 leading-[1.6] mb-5">
        Need something else? Tell us what you need and we'll find the
        right expert for you.
      </p>

      {/* Button */}
      <button className="px-6 py-[10px] border-2 border-blue-600 text-blue-600 text-[14px] font-bold rounded-full transition-all duration-200 hover:bg-blue-600 hover:text-white">
        Get a Quote
      </button>

    </div>
  );
}
