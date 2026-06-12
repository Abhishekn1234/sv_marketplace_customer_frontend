
import { useAuthStore, useSearchStore } from "@/features/core/store/auth";
import { MapPin, ChevronDown, Search, User, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import CommonNotificationFloater from "@/components/common/CommonNotificationFloater";
import Button from "@/components/input/Button";
import { Image, Input } from "@/components/input";

export default function ServiceDetailNavbar() {
  const navigate = useNavigate();

  const { user, current_location, updateAddress } = useAuthStore();
  const { searchTerm, setSearchTerm } = useSearchStore();

  const username = user?.fullName;
  const profileimageurl = user?.profilePictureUrl;

  const location = current_location?.addresses ?? [];

  const homecustomer =
    location.find((address) => address.type === "home")?.value ||
    location.find((address) => address.type === "inputValue")?.value;

  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  /* ---------------------------
     Close dropdown on outside click
  ----------------------------*/
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  /* ---------------------------
     Handle current location
  ----------------------------*/
  const handleLocationClick = async () => {
    setLoading(true);

    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        updateAddress("home", "Current Location", lat, lng);
        updateAddress("inputValue", "Current Location", lat, lng);

        setLoading(false);
        setShowDropdown(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );
  };

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
      
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4 sm:gap-6">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-white">
              <path d="M12 3L4 9v12h16V9l-8-6zm0 2.2L18 9.5V19H6V9.5l6-4.3z" />
              <path d="M12 7L9 10h6l-3-3z" />
            </svg>
          </div>
          <span className="hidden sm:block text-lg sm:text-xl font-bold text-gray-900">
            HomeEase
          </span>
        </div>

        {/* Location Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown((prev) => !prev);
            }}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-semibold text-gray-900 hover:border-blue-600 transition w-[260px] truncate"
          >
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="truncate">{homecustomer || "Select Location"}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {showDropdown && (
            <div className="absolute left-0 mt-2 w-60 bg-white border border-gray-200 rounded-xl shadow-xl z-[9999] overflow-hidden">
              
              {/* Current Location */}
              <Button
                onClick={handleLocationClick}
                disabled={loading}
                className="w-full flex items-center gap-2 text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                Use Current Location
              </Button>

              {/* Saved Locations */}
              {location.map((addr) => (
                <Button
                  key={addr.id}
                  onClick={() => {
                    updateAddress(
                      "home",
                      addr.value,
                      addr.lat ?? 0,
                      addr.lng ?? 0
                    );
                    updateAddress(
                      "inputValue",
                      addr.value,
                      addr.lat ?? 0,
                      addr.lng ?? 0
                    );
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-medium text-gray-700 transition"
                >
                  {addr.value}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
            className="bg-transparent outline-none text-sm w-40"
          />
        </div>

        {/* Notifications */}
        <CommonNotificationFloater />

        {/* Divider */}
        <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

        {/* Profile */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          {profileimageurl ? (
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image src={profileimageurl} alt={username} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}

          <div className="hidden sm:block">
            <div className="text-xs text-gray-400">Premium Member</div>
            <div className="text-sm font-bold">{username}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

