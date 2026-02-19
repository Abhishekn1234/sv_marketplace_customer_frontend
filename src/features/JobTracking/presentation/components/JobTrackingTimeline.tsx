export default function JobTrackingTimeline() {
  const steps = [
    { title: "Booking Confirmed", time: "Today, 9:30 AM", status: "completed" },
    { title: "Professional Assigned", time: "Today, 9:45 AM", status: "completed" },
    { title: "On the Way", time: "Estimated arrival: 11:00 AM", status: "active" },
    { title: "Service Started", time: "Pending", status: "pending" },
    { title: "Service Completed", time: "Pending", status: "pending" },
  ];

  return (
    <div className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-7">
        <h2 className="text-lg font-bold text-gray-900">Service Progress</h2>
        <div className="flex items-center gap-2 px-4 py-1 bg-emerald-100 text-emerald-600 text-xs font-semibold rounded-full">
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          In Progress
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-8">
        <div className="absolute left-2 top-2 bottom-10 w-0.5 bg-gray-200"></div>

        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          const dotClasses =
            step.status === "completed"
              ? "bg-emerald-500"
              : step.status === "active"
              ? "bg-blue-600 animate-pulse"
              : "bg-gray-200";

          return (
            <div key={idx} className={`relative pb-7 ${isLast ? "pb-0" : ""}`}>
              {/* Dot */}
              <div
                className={`absolute -left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${dotClasses}`}
              >
                {step.status === "completed" && (
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
                {step.status === "active" && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <circle cx="12" cy="12" r="4" fill="white" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div
                className={`bg-gray-50 border border-gray-200 rounded-xl p-4 ${
                  step.status === "active" ? "bg-blue-50 border-blue-600" : ""
                }`}
              >
                <div
                  className={`text-sm font-semibold mb-1 ${
                    step.status === "active" ? "text-blue-600" : "text-gray-900"
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 font-medium">{step.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
