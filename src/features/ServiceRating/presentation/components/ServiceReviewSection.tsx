
import { Link } from "react-router-dom";

export default function ServiceReviewSection() {
  return (
    <div className="mb-7">
      {/* Label */}
      <label className="flex items-baseline text-gray-900 font-semibold mb-2.5 text-sm sm:text-base">
        Tell us more
        <span className="ml-2 text-gray-600  text-xs sm:text-sm font-normal">(Optional)</span>
      </label>

      <textarea
        placeholder="Share your experience with Mike..."
        className="w-full min-h-[120px] p-4 sm:p-4 border border-gray-200 rounded-xl text-gray-900 text-sm sm:text-base font-sans resize-vertical focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
      />
      <p className="text-gray-500 text-xs sm:text-sm mt-2 mb-4">
        Your feedback helps us improve our service
      </p>

      <button className="w-full h-14 sm:h-14 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 transition-all">
        Submit Review
      </button>

      <Link
        to="#"
        className="block text-center mt-4 text-gray-500 text-sm sm:text-base font-medium hover:text-blue-600 transition-colors"
      >
        Skip for now
      </Link>
    </div>
  );
}
