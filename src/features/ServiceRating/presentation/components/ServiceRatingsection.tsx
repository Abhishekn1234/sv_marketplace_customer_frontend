import { useLanguage } from "@/features/context/LanguageContext";
import type { FC } from "react";
// import { StarIcon } from "@/components/icons";
// import Button from "@/components/input/Button";
import { StarRowSection } from "./StarRowSection";

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
  const labels = t.serviceratingpage.labels;

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-4 text-center">
      <div className="mx-auto w-full max-w-md">
        {/* Service Rating */}
        <h2 className="mb-4 text-xl sm:text-2xl font-bold text-gray-900">
          {t.serviceratingpage.rateService}
        </h2>

        <StarRowSection
          rating={serviceRating}
          setRating={setServiceRating}
          label={labels?.[serviceRating - 1]}
        />

        {/* Spacing */}
        <div className="my-8 sm:my-10" />

        {/* Worker Rating */}
        <h2 className="mb-4 text-xl sm:text-2xl font-bold text-gray-900">
          {t.serviceratingpage.rateWorker}
        </h2>

        <StarRowSection
          rating={workerRating}
          setRating={setWorkerRating}
          label={labels?.[workerRating - 1]}
        />
      </div>
    </div>
  );
};

export default ServiceRatingSection;