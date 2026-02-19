import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/core/store/auth";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface LanguageFooterProps {
  selectedLanguage: string | null;
  onContinue: () => Promise<void>; 
}

export default function LanguageFooter({ selectedLanguage, onContinue }: LanguageFooterProps) {
  const navigate = useNavigate();
  const { setLanguage } = useAuthStore(); 

  const handleContinue = async () => {
    if (!selectedLanguage) {
      toast.error("Please select a language");
      return;
    }

    let selectedLanguages = "";
    if (selectedLanguage === "ar") selectedLanguages = "Arabic";
    if (selectedLanguage === "en") selectedLanguages = "English";
    if (selectedLanguage === "hi") selectedLanguages = "Hindi";

    try {
      
      await onContinue();

   
      setLanguage(selectedLanguage);

      toast.success(`Language selected: ${selectedLanguages}`);
      navigate("/location");
    } catch (error) {
      toast.error("Failed to save language. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 pb-10">
      <Button
        onClick={handleContinue}
        disabled={!selectedLanguage}
        className="
          w-full max-w-[400px] h-[56px]
          bg-primary text-white font-semibold rounded-[28px]
          inline-flex items-center justify-center gap-2
          shadow-[0_4px_16px_rgba(37,99,235,0.3)]
          transition-all duration-200
          hover:-translate-y-[2px]
          hover:shadow-[0_8px_24px_rgba(37,99,235,0.4)]
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        Continue
        <ArrowRight className="w-5 h-5" />
      </Button>

      <p className="text-sm font-medium text-gray-500 text-center">
        Questions?{" "}
        <span className="text-primary font-bold cursor-pointer hover:underline">
          Talk to our team
        </span>
      </p>
    </div>
  );
}

