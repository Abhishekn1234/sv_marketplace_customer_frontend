import { useAuthStore } from "@/features/core/store/auth";
import { useNavigate } from "react-router-dom";

export default function JobTrackingNavbar() {
  const { customerData } = useAuthStore();
  const location = customerData.current_location?.home;
  const profilephoto = customerData.user?.profilePictureUrl;
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between w-full mb-6 px-4 sm:px-8 py-4">
      
      {/* Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer shrink-0"
        onClick={() => navigate("/")}
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
          <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-white">
            <path d="M12 2.1L2 9.6v11.3h8.2v-6.5h3.6v6.5H22V9.6L12 2.1z" />
          </svg>
        </div>
        <span className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          HomeEase
        </span>
      </div>

      {/* Location (Hidden on small screens) */}
      <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-500 text-sm font-medium transition-all duration-200 hover:border-blue-600 hover:text-blue-600 hover:shadow-sm">
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 text-blue-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span className="whitespace-nowrap">{location}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        
        {/* Notification */}
        <button className="relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-white border border-gray-200 rounded-lg transition-all duration-200 hover:border-blue-600 hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-md">
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-colors duration-200 hover:text-blue-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white animate-pulse"></span>
        </button>

        {/* Profile */}
        <img
          onClick={() => navigate("/profile")}
          src={
            profilephoto
              ? profilephoto
              : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
          }
          alt="User"
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg object-cover cursor-pointer border-2 border-transparent transition-all duration-200 hover:border-blue-600 hover:scale-105 hover:shadow-md"
        />
      </div>
    </header>
  );
}
