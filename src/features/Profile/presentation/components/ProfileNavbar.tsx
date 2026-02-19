import { useAuthStore } from "@/features/core/store/auth";
import { useNavigate } from "react-router-dom";

export default function ProfileNavbar() {
  const { customerData } = useAuthStore();

  const profilepic =
    customerData.user?.profilePictureUrl ||
    "https://ui-avatars.com/api/?name=User";

  const name = customerData.user?.fullName || "User";
  const navigate=useNavigate();

  return (
    <header className="sticky top-0 z-[100] flex items-center justify-between bg-white 
    px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-gray-200 shadow-sm">
      
      {/* Left Section */}
      <div className="flex items-center gap-3 sm:gap-8">
        <div className="flex items-center gap-2.5">
          
          {/* Logo Icon */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-[10px] 
          flex items-center justify-center 
          shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)] cursor-pointer" onClick={()=>navigate('/')}>
            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-[22px] sm:h-[22px] fill-white">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>

          {/* Logo Text */}
          <span className="text-lg sm:text-[22px] font-bold text-gray-900 tracking-[-0.5px]">
            HomeEase
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* Notification Button */}
        <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5 sm:w-[22px] sm:h-[22px]"
          >
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>

          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
        </button>

        {/* Divider (hide on small screens) */}
        <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer">
          <img
            src={profilepic}
            alt="Profile"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
          />

          {/* Hide text on very small screens */}
          <div className="hidden sm:block text-left">
            <div className="text-[11px] font-bold uppercase tracking-[0.5px] text-gray-400">
              Premium Member
            </div>
            <div className="text-sm font-bold text-gray-900 truncate max-w-[140px]">
              {name}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
