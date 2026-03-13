import type { FC } from "react";

interface ServiceRatingSectionProps {
  serviceRating: number;
  setServiceRating: (value: number) => void;
  workerRating: number;
  setWorkerRating: (value: number) => void;
}

const stars = [1, 2, 3, 4, 5];
const labels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

const ServiceRatingSection: FC<ServiceRatingSectionProps> = ({
  serviceRating,
  setServiceRating,
  workerRating,
  setWorkerRating,
}) => {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-lg sm:text-base font-bold text-gray-900 mb-2">
        Rate the Service
      </h2>

      {/* Service Rating */}
      <div className="flex justify-center gap-3 mb-1">
        {stars.map((star) => (
          <div
            key={star}
            className="w-12 h-12 sm:w-10 sm:h-10 cursor-pointer transition-transform transform hover:scale-110"
            onClick={() => setServiceRating(star)}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-full h-full transition-colors ${
                star <= serviceRating ? "fill-yellow-500" : "fill-gray-300"
              }`}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        ))}
      </div>
      <p className="text-sm sm:text-xs text-gray-500 mb-5">
        {labels[serviceRating - 1]}
      </p>

      {/* Worker Rating */}
      <h2 className="text-lg sm:text-base font-bold text-gray-900 mb-2">
        Rate the Worker
      </h2>
      <div className="flex justify-center gap-3 mb-1">
        {stars.map((star) => (
          <div
            key={star}
            className="w-12 h-12 sm:w-10 sm:h-10 cursor-pointer transition-transform transform hover:scale-110"
            onClick={() => setWorkerRating(star)}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-full h-full transition-colors ${
                star <= workerRating ? "fill-yellow-500" : "fill-gray-300"
              }`}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        ))}
      </div>
      <p className="text-sm sm:text-xs text-gray-500 mb-5">
        {labels[workerRating - 1]}
      </p>
    </div>
  );
};

export default ServiceRatingSection;