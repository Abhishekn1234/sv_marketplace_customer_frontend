export default function ProviderWorkingCard() {
  return (
    <div className="bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm">
      <h2 className="text-[16px] font-bold text-gray-900 mb-5">
        Professional on Site
      </h2>

      <div className="flex items-center gap-4 mb-5">
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
          className="w-16 h-16 rounded-2xl object-cover border-4 border-gray-100"
        />

        <div>
          <div className="flex items-center gap-2 text-[17px] font-bold text-gray-900">
            Mike Johnson
            <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
          </div>

          <div className="text-sm text-emerald-600 font-medium">
            Currently working on your service
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 h-11 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition active:scale-95">
          Call
        </button>

        <button className="flex-1 h-11 bg-white border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition active:scale-95">
          Message
        </button>
      </div>
    </div>
  );
}
