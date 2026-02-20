import { useAuthStore } from "@/features/core/store/auth";
import { useNavigate } from "react-router-dom";

const ConfirmationNavbar = () => {
    const {customerData}=useAuthStore();
    const userprofilephoto=customerData.user?.profilePictureUrl;
     const navigate=useNavigate();
  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-gray-200 bg-white">

      {/* LEFT SIDE - LOGO */}
      <div className="flex items-center gap-2.5">
        
        {/* Logo Icon */}
        <div onClick={()=>navigate('/')} className="cursor-pointer w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)]">
          <svg
            viewBox="0 0 24 24"
            className="w-[22px] h-[22px] fill-white"
          >
            <path d="M12 3L4 9v12h16V9l-8-6zm0 2.2L18 9.5V19H6V9.5l6-4.3z" />
            <path d="M12 7L9 10h6l-3-3z" />
          </svg>
        </div>

        {/* Logo Text */}
        <span className="text-[22px] font-bold text-gray-900 tracking-[-0.5px]">
          HomeEase
        </span>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">

        {/* Notification Button */}
        <button className="relative p-2 text-gray-400 transition-colors duration-200 hover:text-blue-600">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-[22px] h-[22px]"
          >
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </button>

        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_4px_12px_rgba(37,99,235,0.3)] cursor-pointer" onClick={()=>navigate("/profile")}>
        {userprofilephoto?(
          <img src={userprofilephoto} alt="User Profile" className="w-full h-full rounded-full object-cover" />
        ):(
            <>  <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5 text-white"
          >
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg></> 
        )}
        
         
        </div>
      </div>
    </header>
  );
};

export default ConfirmationNavbar;
