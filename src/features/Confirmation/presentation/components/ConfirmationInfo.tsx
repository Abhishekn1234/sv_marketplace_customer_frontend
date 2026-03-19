export default function ConfirmationInfo() {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-xs font-bold uppercase text-gray-400">
          Booking Summary
        </h3>
      </div>

      {/* Content */}
      <div className="flex gap-4 p-5 bg-emerald-50">
        
        {/* Icon */}
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-600">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>

        {/* Text */}
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">
            Provider Assignment in Progress
          </h4>
          <p className="text-sm text-gray-500">
            We’re assigning the best provider for your location. You’ll be notified soon.
          </p>
        </div>

      </div>
    </div>
  );
}