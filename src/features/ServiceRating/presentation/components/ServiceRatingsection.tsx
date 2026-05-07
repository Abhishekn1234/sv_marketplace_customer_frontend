import { useLanguage } from "@/features/context/LanguageContext";
import type { FC } from "react";
import { StarIcon } from "@/components/icons";
import Button from "@/components/input/Button";

interface ServiceRatingSectionProps {
  serviceRating: number;
  setServiceRating: (value: number) => void;
  workerRating: number;
  setWorkerRating: (value: number) => void;
}

const ServiceRatingSection: FC<ServiceRatingSectionProps> = ({
  serviceRating,
  setServiceRating,
  workerRating,
  setWorkerRating,
}) => {
  const { t } = useLanguage();

  const stars = [1, 2, 3, 4, 5];
  const labels = t.serviceratingpage.labels;

  return (
    <div className="mb-8 text-center">
      
      {/* SERVICE RATING */}
      <h2 className="text-lg sm:text-base font-bold text-gray-900 mb-2">
        {t.serviceratingpage.rateService}
      </h2>

      <div className="flex justify-center gap-3 mb-1">
        {stars.map((star) => (
          <Button
            key={star}
            type="button"
            onClick={() => setServiceRating(star)}
            className="w-32 h-32 sm:w-20 sm:h-20 transition-transform hover:scale-110"
          >
            <StarIcon
              className={`w-full h-full transition-colors ${
                star <= serviceRating
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300 fill-gray-300"
              }`}
            />
          </Button>
        ))}
      </div>

      <p className="text-sm sm:text-xs text-gray-500 mb-5">
        {labels?.[serviceRating - 1]}
      </p>

      {/* WORKER RATING */}
      <h2 className="text-lg sm:text-base font-bold text-gray-900 mb-2">
        {t.serviceratingpage.rateWorker}
      </h2>

      <div className="flex justify-center gap-3 mb-1">
        {stars.map((star) => (
          <Button
            key={star}
            type="button"
            onClick={() => setWorkerRating(star)}
           className="w-32 h-32 sm:w-20 sm:h-20 transition-transform hover:scale-110"
          >
            <StarIcon
              className={`w-full h-full transition-colors ${
                star <= workerRating
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300 fill-gray-300"
              }`}
            />
          </Button>
        ))}
      </div>

      <p className="text-sm sm:text-xs text-gray-500 mb-5">
        {labels?.[workerRating - 1]}
      </p>
    </div>
  );
};

export default ServiceRatingSection;