import { useLanguage } from "@/features/context/LanguageContext";
import { useAuthStore } from "@/features/core/store/auth";

import { BackArrowIcon, LogoutIcon } from "@/components/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/input/Button";

export default function ProfileTop() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
   const {t}=useLanguage();
  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="mb-6">

      {/* Back Button */}
      <Button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 mb-4 text-sm font-semibold 
        text-gray-400 hover:text-blue-600 transition-colors"
        leftIcon={
          <>
            <BackArrowIcon className="w-5 h-5" />
          </>
        }
      >
       
       {t.common.GoToHome}
      </Button>

      {/* Title + Logout Row */}
      <div className="flex items-center justify-between gap-4">
        
        <h1 className="text-2xl sm:text-3xl lg:text-[42px] font-bold text-gray-900 tracking-[-0.02em]">
          {t.profilepage.myProfile}
        </h1>

        <Button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 sm:px-6 py-2 
          rounded-xl border-2 border-blue-600 
          text-blue-600 font-semibold text-sm sm:text-base
          hover:bg-blue-600 hover:text-white 
          transition-all duration-200 whitespace-nowrap"
          rightIcon={
            <>
               <LogoutIcon className="w-5 h-5" />
            </>
           
          }
        >
         
          {t.profilepage.logout}
        </Button>

      </div>
    </div>
  );
}