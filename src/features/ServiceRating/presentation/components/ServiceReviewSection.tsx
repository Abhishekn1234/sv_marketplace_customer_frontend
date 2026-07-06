import { Label, Textarea } from "@/components/input";
import Button from "@/components/input/Button";
import { useLanguage } from "@/features/context/LanguageContext";
import type { FC } from "react";

interface ServiceReviewSectionProps {
  feedback: string;
  setFeedback: (value: string) => void;
  onSubmit: () => void;
}

const ServiceReviewSection: FC<ServiceReviewSectionProps> = ({
  feedback,
  setFeedback,
  onSubmit,
}) => {
  const { t } = useLanguage();

  return (
    <div className="mb-7">
      <Label className="flex items-baseline text-gray-900 font-semibold mb-2.5 text-sm sm:text-base">
        {t.serviceratingpage.tellUsMore}
        <span className="ml-2 text-gray-600 text-xs sm:text-sm font-normal">
          ({t.serviceratingpage.optional})
        </span>
      </Label>

      <Textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder={t.serviceratingpage.shareExperience}
        className="w-full min-h-[120px] p-3 sm:p-4 border border-gray-200 rounded-xl text-gray-900 text-sm sm:text-base font-sans resize-vertical focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
      />

      <p className="text-gray-500 text-xs sm:text-sm mt-2 mb-4">
        {t.serviceratingpage.feedbackHelp}
      </p>

      <Button
        onClick={onSubmit}
        className="w-full h-12 sm:h-14 bg-blue-600 text-white  hover:text-blue-200 text-sm sm:text-base font-semibold rounded-xl shadow-md hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 transition-all"
      >
        {t.serviceratingpage.submitReview}
      </Button>
    </div>
  );
};

export default ServiceReviewSection;