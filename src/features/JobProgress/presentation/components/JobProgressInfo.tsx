export function JobProgressInfo() {
  return (
    <div className="flex flex-col gap-5 sticky top-6">
      
      {/* Summary */}
      <div className="bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm">
        <h3 className="text-[16px] font-bold text-gray-900 mb-5">
          Service Summary
        </h3>

        {[
          ["Service Type", "Plumbing Repair"],
          ["Service Tier", "Standard"],
          ["Base Price", "$75.00"],
          ["Materials", "$14.00"],
        ].map((item, i) => (
          <div
            key={i}
            className="flex justify-between py-2 border-b border-gray-100"
          >
            <span className="text-sm text-gray-500 font-medium">
              {item[0]}
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {item[1]}
            </span>
          </div>
        ))}

        <div className="flex justify-between pt-4 mt-2 border-t-2 border-gray-200">
          <span className="text-sm text-gray-500 font-medium">Total</span>
          <span className="text-[18px] font-bold text-blue-600">$89.00</span>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm">
        <h3 className="text-[16px] font-bold text-gray-900 mb-4">
          Service Info
        </h3>

        <div className="space-y-4 text-sm">
          <div>
            <div className="text-gray-500 text-[13px]">Date</div>
            <div className="font-semibold text-gray-900">
              January 31, 2026
            </div>
          </div>

          <div>
            <div className="text-gray-500 text-[13px]">Duration</div>
            <div className="font-semibold text-gray-900">
              1 hour 15 minutes
            </div>
          </div>

          <div>
            <div className="text-gray-500 text-[13px]">Location</div>
            <div className="font-semibold text-gray-900">
              123 Main St, Apt 4B
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
