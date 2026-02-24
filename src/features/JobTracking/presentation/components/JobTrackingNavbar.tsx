import CommonNotificationFloater from "@/components/common/CommonNotificationFloater";
import { useAuthStore } from "@/features/core/store/auth";
import { getCurrentLocationName } from "@/features/utils/reverse";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function JobTrackingNavbar() {
  const navigate = useNavigate();
  const { customerData, addAddress, updateAddress } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const profilephoto = customerData.user?.profilePictureUrl;
  const addresses = customerData.current_location?.addresses || [];
  const current_location =
    addresses.find((add) => add.type === "home")?.value ||
    addresses.find((add) => add.type === "inputValue")?.value;

  /* ---------------------------
     Use Current Location
  ----------------------------*/
  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLocation(true);

    try {
      const { placeName } = await getCurrentLocationName();

      // Add or update 'home'
      const hasHome = addresses.some((addr) => addr.type === "home");
      if (hasHome) {
        updateAddress("home", placeName);
      } else {
        addAddress("home", placeName);
      }

      // Add or update 'inputValue'
      const hasInputValue = addresses.some((addr) => addr.type === "inputValue");
      if (hasInputValue) {
        updateAddress("inputValue", placeName);
      } else {
        addAddress("inputValue", placeName);
      }

      toast.success("Current location updated successfully!");
      setDropdownOpen(false);
    } catch (error) {
      console.error("Geolocation error:", error);
      toast.error("Unable to retrieve your location");
    } finally {
      setLoadingLocation(false);
    }
  };

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
        <span className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">HomeEase</span>
      </div>

      {/* Location Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className={`hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-500 text-sm font-medium transition-all duration-200 hover:border-blue-600 hover:text-blue-600 hover:shadow-sm ${
            loadingLocation ? "opacity-60 pointer-events-none" : ""
          }`}
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
          <span>{loadingLocation ? "Detecting..." : current_location || "Select Current Location"}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3 text-gray-400">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
            <button
              onClick={handleUseCurrentLocation}
              disabled={loadingLocation}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center justify-between"
            >
              <span>Use Current Location</span>
              {loadingLocation && <span className="text-xs text-gray-500 ml-2">Loading...</span>}
            </button>

            {/* {addresses.map((addr) => (
              <button
                key={addr.id}
                onClick={() => {
                  updateAddress("home", addr.value);
                  updateAddress("inputValue", addr.value);
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between text-sm"
              >
                {addr.value}
              </button>
            ))} */}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Notification */}
       <CommonNotificationFloater/>

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