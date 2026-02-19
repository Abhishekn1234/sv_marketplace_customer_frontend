export default function JobTrackingNeedHelp() {
  const options = [
    {
      text: "Contact Support",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-5 h-5"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    {
      text: "Chat with Us",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-5 h-5"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      text: "Cancel Booking",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-5 h-5"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-4">Need Help?</h3>
      <div className="flex flex-col gap-3">
        {options.map((opt, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer transition-all border border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 transition-colors group-hover:bg-blue-50 group-hover:border-blue-600">
              {opt.icon}
            </div>
            <span className="text-sm font-semibold text-gray-900">{opt.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
