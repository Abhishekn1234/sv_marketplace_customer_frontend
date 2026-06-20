

import { useLanguage } from "@/features/context/LanguageContext";
import Button from "@/components/input/Button";
import { ArrowRight } from "@/components/icons";

export default function ConfirmLocationFooter({
  onConfirm,
}: {
  onConfirm: () => void;
}) {
  const { t } = useLanguage();

  return (
    <>
      <Button
        onClick={onConfirm}
        rightIcon={
          <>
          <ArrowRight  />  
          </>
        }
        className="w-full max-w-[500px] h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg flex items-center justify-center gap-2 mt-4"
      >
        {t.location.confirmLocation}
        
      </Button>

      <p className="text-sm text-gray-500 mt-2">
        {t.location.dontSeeCity}{" "}
        <span className="text-primary font-semibold cursor-pointer hover:underline">
          {t.location.suggestLocation}
        </span>
      </p>
    </>
  );
}
