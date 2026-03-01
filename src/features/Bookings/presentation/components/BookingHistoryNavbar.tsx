import CommonNotificationFloater from "@/components/common/CommonNotificationFloater";
import { useAuthStore } from "@/features/core/store/auth";
import { getCurrentLocationName } from "@/features/utils/reverse";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function BookingHistoryNavbar() {
  const navigate = useNavigate();
 const { user, current_location,  updateHome } = useAuthStore();
  const [loadingLocation, setLoadingLocation] = useState(false);

 const selectedLocation =
  current_location?.addresses?.find((add) => add.type === "home")?.value ||
  current_location?.addresses?.find((add) => add.type === "inputValue")?.value;

  const profilephoto = user?.profilePictureUrl;

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

    updateHome("home", placeName);
    updateHome("inputValue", placeName);

    toast.success("Current location updated successfully!");
  } catch (error) {
    console.error("Geolocation error:", error);
    toast.error("Unable to retrieve your location");
  } finally {
    setLoadingLocation(false);
  }
};

  return (
    <header className="top-0 z-50 w-full px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between bg-white border-b border-gray-200 shadow-sm">
      {/* 🔹 Logo Section */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-3 transition-transform duration-200 hover:scale-105 cursor-pointer"
      >
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
            <path d="M12 2.1L2 9.6v11.3h8.2v-6.5h3.6v6.5H22V9.6L12 2.1z" />
          </svg>
        </div>
        <span className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">HomeEase</span>
      </div>

      {/* 🔹 Location */}
      <div
        onClick={handleUseCurrentLocation}
        className={`hidden md:flex items-center gap-2 text-gray-500 text-sm font-medium px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-blue-600 hover:text-blue-600 hover:shadow-sm transition-all duration-200 cursor-pointer ${
          loadingLocation ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-4 h-4 text-blue-600"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
       <span>
  {loadingLocation
    ? "Detecting..."
    : selectedLocation || "Select Current Location"}
</span>
      </div>

      {/* 🔹 Right Actions */}
      <div className="flex items-center gap-4">
       <CommonNotificationFloater/>

        {profilephoto ? (
          <img
            onClick={() => navigate("/profile")}
            src={profilephoto}
            alt="User"
            className="w-11 h-11 rounded-xl object-cover cursor-pointer border-2 border-transparent hover:border-blue-600 hover:scale-105 hover:shadow-md transition-all duration-200"
          />
        ) : (
          <img
            onClick={() => navigate("/profile")}
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
            alt="User"
            className="w-11 h-11 rounded-xl object-cover cursor-pointer border-2 border-transparent hover:border-blue-600 hover:scale-105 hover:shadow-md transition-all duration-200"
          />
        )}
      </div>
    </header>
  );
}


