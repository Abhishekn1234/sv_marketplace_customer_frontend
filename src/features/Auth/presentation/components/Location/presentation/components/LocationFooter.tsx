"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/features/context/LanguageContext";
import { useAuthStore } from "@/features/core/store/auth";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LocationFooter() {
  const { t } = useLanguage();
  const current_location = useAuthStore((s) => s.current_location);
 const navigate=useNavigate();
  const handleContinue = () => {
  

    console.log("Saved locations:", current_location);
    toast.success("Locations saved successfully!");
    navigate('/register');
    
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full mt-6 mb-10">
     <form
  onSubmit={(e) => {
    e.preventDefault();
    handleContinue();
  }}
  className="flex flex-col items-center gap-4 w-full mt-6 mb-10"
>
  <Button
    type="submit"
    className="w-full max-w-[500px] h-14 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-bold rounded-full shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
  >
    {t.location.confirmLocation ?? "Confirm Location"}
    <ArrowRight className="w-5 h-5" />
  </Button>

  <p className="text-sm text-gray-500">
    {t.location.dontSeeCity ?? "Don't see your city?"}{" "}
    <span className="text-primary font-semibold cursor-pointer hover:underline">
      {t.location.suggestLocation ?? "Suggest Location"}
    </span>
  </p>
</form>


    
    </div>
  );
}
