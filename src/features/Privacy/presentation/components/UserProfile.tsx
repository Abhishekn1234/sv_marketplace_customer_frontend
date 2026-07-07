import React from "react";
import { useAuthStore } from "@/features/core/store/auth";
import { useNavigate } from "react-router-dom";
import { UserIcon } from "@/components/icons";
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
               <UserIcon/>
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
