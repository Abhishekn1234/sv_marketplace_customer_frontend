// import { useAuthStore } from "@/features/core/store/auth";
// import {
//   MapPin,
//   ChevronDown,
//   Search,
//   Bell,
//   User,
//   Loader2,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useState, useRef, useEffect } from "react";

// export default function ServiceDetailNavbar() {
//   const navigate = useNavigate();
//   const { customerData, updateAddress } = useAuthStore();

//   const username = customerData?.user?.fullName;
//   const location = customerData?.current_location?.inputValue;
//   const profileimageurl = customerData?.user?.profilePictureUrl;

//   const [showLocationDropdown, setShowLocationDropdown] = useState(false);
//   const [loadingLocation, setLoadingLocation] = useState(false);

//   const dropdownRef = useRef<HTMLDivElement | null>(null);

//   /* -------------------------------
//      Outside Click Close (FIXED)
//   --------------------------------*/
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setShowLocationDropdown(false);
//       }
//     };

//     document.addEventListener("click", handleClickOutside);
//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, []);

//   /* -------------------------------
//      Use Current Location
//   --------------------------------*/
//   const handleUseCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       toast.error("Geolocation is not supported by your browser");
//       return;
//     }

//     setLoadingLocation(true);

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;

//         try {
//           const response = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
//             {
//               headers: {
//                 Accept: "application/json",
//               },
//             }
//           );

//           const data = await response.json();

//           if (!data?.display_name) {
//             throw new Error("Address not found");
//           }

//           const address = data.display_name;

//           // Save in store (as per your function)
//           updateAddress("home", address);
//           updateAddress("inputValue", address);

//           toast.success("Location updated successfully!");
//           setShowLocationDropdown(false);
//         } catch (error) {
//           toast.error("Failed to fetch address");
//         } finally {
//           setLoadingLocation(false);
//         }
//       },
//       () => {
//         toast.error("Unable to retrieve your location");
//         setLoadingLocation(false);
//       }
//     );
//   };

//   return (
//     <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
      
//       {/* LEFT SECTION */}
//       <div className="flex items-center gap-4 sm:gap-6">

//         {/* Logo */}
//         <div
//           className="flex items-center gap-2 cursor-pointer"
//           onClick={() => navigate("/")}
//         >
//           <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
//             <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-white">
//               <path d="M12 3L4 9v12h16V9l-8-6zm0 2.2L18 9.5V19H6V9.5l6-4.3z" />
//               <path d="M12 7L9 10h6l-3-3z" />
//             </svg>
//           </div>
//           <span className="hidden sm:block text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
//             HomeEase
//           </span>
//         </div>

//         {/* Location Dropdown */}
//         <div className="relative" ref={dropdownRef}>
//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation();
//               setShowLocationDropdown((prev) => !prev);
//             }}
//             className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-full text-xs sm:text-sm font-semibold text-gray-900 hover:border-blue-600 transition max-w-[180px] truncate"
//           >
//             <MapPin className="w-4 h-4 text-blue-600" />
//             <span className="truncate">
//               {location || "Select Location"}
//             </span>
//             <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
//           </button>

//           {showLocationDropdown && (
//             <div className="absolute left-0 mt-2 w-60 bg-white border border-gray-200 rounded-xl shadow-xl z-[9999] overflow-hidden animate-fadeIn">
//               <button
//                 onClick={handleUseCurrentLocation}
//                 disabled={loadingLocation}
//                 className="w-full flex items-center gap-2 text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition disabled:opacity-60"
//               >
//                 {loadingLocation ? (
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                 ) : (
//                   <MapPin className="w-4 h-4" />
//                 )}
//                 Use Current Location
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* RIGHT SECTION */}
//       <div className="flex items-center gap-3 sm:gap-5">

//         {/* Search */}
//         <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-600 transition">
//           <Search className="w-4 h-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search services..."
//             className="bg-transparent outline-none text-sm font-medium text-gray-900 w-40 placeholder-gray-400"
//           />
//         </div>

//         {/* Notification */}
//         <button className="relative p-2 text-gray-400 hover:text-blue-600 transition">
//           <Bell className="w-5 h-5" />
//           <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
//         </button>

//         <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

//         {/* Profile */}
//         <div
//           className="flex items-center gap-2 sm:gap-3 cursor-pointer"
//           onClick={() => navigate("/profile")}
//         >
//           {profileimageurl ? (
//             <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden shadow-md">
//               <img
//                 src={profileimageurl}
//                 alt={username}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           ) : (
//             <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
//               <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
//             </div>
//           )}

//           <div className="hidden sm:block text-left">
//             <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
//               Premium Member
//             </div>
//             <div className="text-sm font-bold text-gray-900">
//               {username}
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }
