export default function JobTrackingWorkerDetails() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <h2 className="text-base font-bold text-gray-900 mb-5">Your Professional</h2>

      <div className="flex items-center gap-4 mb-5">
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
          alt="Provider"
          className="w-18 h-18 rounded-xl object-cover border-2 border-gray-100"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-lg mb-1">
            Mike Johnson
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-1 text-yellow-400 font-semibold text-sm mb-1">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            4.9 (127 reviews)
          </div>
          <div className="text-sm text-gray-500">Plumbing Expert • 5 years exp.</div>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 h-12 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-5 h-5"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Call
        </button>
        <button className="flex-1 h-12 rounded-lg bg-white border border-gray-200 font-semibold text-gray-900 hover:bg-gray-50 flex items-center justify-center gap-2 transition-all">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-5 h-5"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Message
        </button>
      </div>
    </div>
  );
}
