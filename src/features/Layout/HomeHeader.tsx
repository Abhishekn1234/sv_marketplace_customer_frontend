import React from "react";
import { useAuthStore } from "../core/store/auth";
import { useNavigate, type NavigateFunction } from "react-router-dom";

const HomeHeader: React.FC = () => {
  const { customerData } = useAuthStore();
  const userlocation = customerData.current_location?.inputValue;
  const userphoto = customerData.user?.profilePictureUrl;
  const navigate=useNavigate();
  return (
    <header className="w-full bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-3">

          {/* Left: Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/30">
              <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-white">
                <path d="M12 3L4 9v12h16V9l-8-6zm0 2.2L18 9.5V19H6V9.5l6-4.3z" />
                <path d="M12 7L9 10h6l-3-3z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900 hidden sm:inline">
              HomeEase
            </span>
          </div>

          {/* Center: Location */}
          <div
            title={userlocation}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 cursor-pointer transition-all hover:border-blue-600 hover:text-blue-600 hover:shadow-sm flex-1 min-w-0"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-[18px] h-[18px] text-blue-600 shrink-0"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>

            <span className="truncate">
              {userlocation ?? "Select location"}
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer">
            <NotificationButton />
            <UserAvatar photo={userphoto}  navigate={navigate}/>
          </div>

        </div>
      </div>
    </header>
  );
};



const NotificationButton = () => (
  <button className="relative w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center cursor-pointer justify-center transition-all hover:border-blue-600 hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-md">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-5 h-5 text-gray-500 transition-colors hover:text-blue-600"
    >
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
  </button>
);

interface UserAvatarProps {
  photo?: string;
  navigate:NavigateFunction
}

const UserAvatar: React.FC<UserAvatarProps> = ({ photo,navigate }) => (
  <img
    src={photo || "/avatar-placeholder.png"}
    alt="User"
    onClick={()=>navigate('/profile')}
    className="w-10 h-10 rounded-xl object-cover cursor-pointer border-2 border-transparent transition-all hover:border-blue-600 hover:scale-105 hover:shadow-md"
  />
);

export default HomeHeader;
