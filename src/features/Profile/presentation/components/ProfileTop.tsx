import { useLanguage } from "@/features/context/LanguageContext";
import { useAuthStore } from "@/features/core/store/auth";
import { LogOutIcon } from "lucide-react";
import { BackArrowIcon } from "@/components/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProfileTop() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
   const {t}=useLanguage();
  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  return (
    <div className="mb-6">

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 mb-4 text-sm font-semibold 
        text-gray-400 hover:text-blue-600 transition-colors"
      >
        <BackArrowIcon className="w-5 h-5" />
       {t.profilepage.backToDashboard}
      </button>

      {/* Title + Logout Row */}
      <div className="flex items-center justify-between gap-4">
        
        <h1 className="text-2xl sm:text-3xl lg:text-[42px] font-bold text-gray-900 tracking-[-0.02em]">
          {t.profilepage.myProfile}
        </h1>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 sm:px-6 py-2 
          rounded-xl border-2 border-blue-600 
          text-blue-600 font-semibold text-sm sm:text-base
          hover:bg-blue-600 hover:text-white 
          transition-all duration-200 whitespace-nowrap"
        >
          <LogOutIcon size={18} />
          {t.profilepage.logout}
        </button>

      </div>
    </div>
  );
}