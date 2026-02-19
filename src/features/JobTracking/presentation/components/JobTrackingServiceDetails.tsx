export default function JobTrackingServiceDetails() {
  const serviceDetails = [
    { label: "Service Type", value: "Plumbing Repair" },
    { label: "Service Tier", value: "Standard" },
    { label: "Date & Time", value: "Jan 31, 11:00 AM" },
    { label: "Address", value: "123 Main St, Apt 4B" },
    { label: "Total Price", value: "$89.00", isPrice: true },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-5">Service Details</h3>
      <div className="flex flex-col divide-y divide-gray-100">
        {serviceDetails.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center py-3"
          >
            <span className="text-sm font-medium text-gray-500">{item.label}</span>
            <span
              className={`text-sm font-semibold ${
                item.isPrice ? "text-blue-600 text-base" : "text-gray-900"
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
