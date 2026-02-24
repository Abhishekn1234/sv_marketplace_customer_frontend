import ServiceRatingSection from "./ServiceRatingsection";
import SuccessTagSection from "./SuccessTagSection";
import ServiceReviewSection from "./ServiceReviewSection";

export default function SuccessProviderCard() {
  return (
    <div className="bg-white rounded-4xl p-10 sm:p-8 xs:p-6 border border-gray-200 shadow-lg max-w-xl mx-auto">
      {/* Provider Section */}
      <div className="text-center mb-8">
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
          alt="Provider"
          className="w-24 h-24 sm:w-20 sm:h-20 rounded-2xl border-4 border-gray-100 object-cover mx-auto mb-4"
        />
        <div className="flex items-center justify-center gap-2 text-lg sm:text-base font-bold text-gray-900 mb-1">
          Mike Johnson
          <div className="w-5.5 h-5.5 sm:w-5 sm:h-5 bg-blue-600 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
        </div>
        <p className="text-sm sm:text-xs text-gray-500 font-medium">
          Plumbing Repair Service
        </p>
      </div>

      {/* Rating Section */}
      <ServiceRatingSection />

      {/* Tag Section */}
      <SuccessTagSection />

      {/* Review Section */}
      <ServiceReviewSection />
    </div>
  );
}







