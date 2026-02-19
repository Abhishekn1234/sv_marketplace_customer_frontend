import { useAuthStore } from "@/features/core/store/auth";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CommonNavbar(){
 const { customerData, updateAddress } = useAuthStore();
   const username = customerData.user?.fullName;
   const profileurl = customerData.user?.profilePictureUrl;
   const customerplace = customerData.current_location?.inputValue;
 
   const [dropdownOpen, setDropdownOpen] = useState(false);
   const [loadingLocation, setLoadingLocation] = useState(false);
 
   const navigate = useNavigate(); // 👈 initialize navigate
 
   const handleUseCurrentLocation = () => {
     if (!navigator.geolocation) {
       toast.error("Geolocation is not supported by your browser");
       return;
     }
 
     setLoadingLocation(true);
 
     navigator.geolocation.getCurrentPosition(
       async (position) => {
         const { latitude, longitude } = position.coords;
 
         try {
           const res = await fetch(
             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
           );
           const data = await res.json();
           const address = data.display_name;
 
           // Save to customerData store
           updateAddress("home", address);
           updateAddress("inputValue", address);
 
           toast.success("Current location saved successfully!");
         } catch (err) {
           console.error("Reverse geocoding error:", err);
           toast.error("Failed to get address from coordinates");
         } finally {
           setLoadingLocation(false);
           setDropdownOpen(false);
         }
       },
       (error) => {
         console.error("Geolocation error:", error);
         toast.error("Unable to retrieve your location");
         setLoadingLocation(false);
       },
       { enableHighAccuracy: true }
     );
   };
 
   return (
     <header className="fixed top-0 left-0 w-full z-[9999] bg-white border-b border-gray-200 shadow-sm">
       <div className="flex items-center justify-between px-6 lg:px-8 py-5">
         {/* Left Section */}
         <div className="flex items-center gap-8">
           {/* Logo */}
           <div
             className="flex items-center gap-2 cursor-pointer"
             onClick={() => navigate("/")} // 👈 navigate to profile on click
           >
             <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
               <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                 <path d="M12 3L4 9v12h16V9l-8-6zm0 2.2L18 9.5V19H6V9.5l6-4.3z" />
                 <path d="M12 7L9 10h6l-3-3z" />
               </svg>
             </div>
             <span className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
               HomeEase
             </span>
           </div>
 
           {/* Location Button */}
           <div className="relative">
             <button
               onClick={() => setDropdownOpen((prev) => !prev)}
               className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-full text-sm font-semibold text-gray-900 transition-all hover:border-blue-600"
             >
               <svg
                 viewBox="0 0 24 24"
                 fill="none"
                 stroke="currentColor"
                 strokeWidth={2}
                 className="w-4 h-4 text-blue-600"
               >
                 <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                 <circle cx="12" cy="10" r="3" />
               </svg>
               {customerplace || "Select location"}
               <svg
                 viewBox="0 0 24 24"
                 fill="none"
                 stroke="currentColor"
                 strokeWidth={2}
                 className="w-3.5 h-3.5 text-gray-400"
               >
                 <polyline points="6 9 12 15 18 9" />
               </svg>
             </button>
 
             {/* Dropdown */}
             {dropdownOpen && (
               <div className="absolute top-full mt-2 w-56 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50">
                 <button
                   onClick={handleUseCurrentLocation}
                   className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center justify-between"
                   disabled={loadingLocation}
                 >
                   <span>Use Current Location</span>
                   {loadingLocation && <span className="text-xs text-gray-500">Loading...</span>}
                 </button>
               </div>
             )}
           </div>
         </div>
 
         {/* Right Section */}
         <div className="flex items-center gap-6">
           {/* Notification */}
           <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors">
             <svg
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               strokeWidth={2}
               className="w-5 h-5"
             >
               <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
               <path d="M13.73 21a2 2 0 01-3.46 0" />
             </svg>
             <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
           </button>
 
           {/* Divider */}
           <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
 
           {/* User Profile */}
           <div
             className="flex items-center gap-3 cursor-pointer"
             onClick={() => navigate("/profile")} // 👈 navigate to profile on click
           >
             <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
               {profileurl ? (
                 <img src={profileurl} alt={username} className="w-full h-full rounded-full object-cover" />
               ) : (
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
               )}
             </div>
             <div className="hidden lg:flex flex-col text-left">
               <span className="text-xs font-bold uppercase text-gray-400">Premium Member</span>
               <span className="text-sm font-bold text-gray-900">{username}</span>
             </div>
           </div>
         </div>
       </div>
     </header>
   );
}