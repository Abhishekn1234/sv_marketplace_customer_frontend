import React from "react";
import { useAuthStore } from "@/features/core/store/auth";
import { useNavigate } from "react-router-dom";
const UserProfile: React.FC = () => {
    const {user}=useAuthStore();
    const name=user?.fullName;
    const profilephoto=user?.profilePictureUrl;
    const navigate=useNavigate();
    return(
       <div className="flex items-center gap-3 cursor-pointer">
    <div onClick={()=>navigate('/profile')}>
     
     {
        profilephoto ? (
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <img src={profilephoto}/>
            </div>
            
        ):(
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
                <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="w-5 h-5 text-white"
      >
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
            </div>
         
        )
     } 
    </div>
    <div className="hidden md:block text-left">
      <div className="text-gray-400 text-xs uppercase font-bold">Premium</div>
      <div className="text-gray-900 text-sm font-bold">{name}</div>
    </div>
  </div>
    );
 
};

export default UserProfile;
