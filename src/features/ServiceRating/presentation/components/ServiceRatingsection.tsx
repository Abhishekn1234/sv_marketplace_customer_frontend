import  { useState } from "react";

export default function ServiceRatingSection() {
  const [rating, setRating] = useState(4); // default rating
  const stars = [1, 2, 3, 4, 5];
  const labels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="mb-8 text-center">
      <h2 className="text-lg sm:text-base font-bold text-gray-900 mb-2">
        How was your service?
      </h2>
      <p className="text-sm sm:text-xs text-gray-500 mb-5">
        Tap a star to rate your experience
      </p>

      {/* Stars */}
      <div className="flex justify-center gap-3 mb-3">
        {stars.map((star) => (
          <div
            key={star}
            className="w-12 h-12 sm:w-10 sm:h-10 cursor-pointer transition-transform transform hover:scale-110"
            onClick={() => setRating(star)}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-full h-full transition-colors ${
                star <= rating ? "fill-yellow-500" : "fill-gray-300"
              }`}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        ))}
      </div>

      {/* Rating Label */}
      <p className="text-base sm:text-sm font-semibold text-gray-900 min-h-[24px]">
        {labels[rating - 1]}
      </p>
    </div>
  );
}
