'use client';

import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, ChevronDown, Search } from "lucide-react";
import CommonNotificationFloater from "@/components/common/CommonNotificationFloater";
import { useAuthStore, useSearchStore } from "@/features/core/store/auth";
import { useUpdateCurrentLocation } from "@/features/Auth/presentation/components/Location/presentation/hooks/useCurrentlocation";

interface NavbarProps {
  showBackButton?: boolean;
  showSearch?: boolean;
  showLocation?: boolean;
  title?: string;
  rightButton?: {
    label: string;
    to: string;
    variant?: "primary" | "link";
  };
  showUserControls?: boolean; 
   showHomeLinks?: boolean;
}

const CommonNavbar: React.FC<NavbarProps> = ({
  showBackButton = false,
  showSearch = false,
  showLocation = false,
  title = "HomeEase",
  rightButton,
  showUserControls = true,
  showHomeLinks=false
}) => {
  const navigate = useNavigate();
  const { customerData,  } = useAuthStore();
  const { searchTerm, setSearchTerm } = useSearchStore();
  const { handleUseCurrentLocation } = useUpdateCurrentLocation();
  // updateAddress
  const profilePic = customerData?.user?.profilePictureUrl;
  const location = customerData?.current_location?.addresses ?? [];
  const currentLocation =
    location.find((addr) => addr.type === "home")?.value ||
    location.find((addr) => addr.type === "inputValue")?.value;

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">

        {/* Left Section: Logo, Back Button, Location */}
        <div className="flex items-center gap-4 min-w-0">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)]">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M12 2.1L2 9.6v11.3h8.2v-6.5h3.6v6.5H22V9.6L12 2.1z" />
              </svg>
            </div>
           <span className="hidden sm:block font-bold text-lg truncate text-gray-900">
              {title}
            </span>
          </div>

          {/* Back Button */}
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 border rounded-xl text-sm font-semibold hover:border-blue-600 hover:bg-blue-50 transition"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" stroke="currentColor" strokeWidth={2} fill="none">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}

          {/* Location Dropdown */}
          {showLocation && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex items-center gap-1 px-3 py-2 bg-gray-50 border rounded-full text-sm font-medium hover:border-blue-600 transition truncate"
              >
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="truncate">{currentLocation || "Select Location"}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {showDropdown && (
                <div className="absolute left-0 mt-2 w-60 bg-white border rounded-xl shadow-lg overflow-hidden z-50">
                  <button
                    onClick={handleUseCurrentLocation}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm font-medium"
                  >
                    Use Current Location
                  </button>
                  {/* {location.map((addr) => (
                    <button
                      key={addr.id}
                      onClick={() => {
                        updateAddress("home", addr.value);
                        updateAddress("inputValue", addr.value);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-medium"
                    >
                      {addr.value}
                    </button>
                  ))} */}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section: Search, Right Button, User Controls */}
        <div className="flex items-center gap-4">
          {showSearch && (
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 border rounded-xl">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search services..."
                className="bg-transparent outline-none text-sm text-gray-900"
              />
            </div>
          )}
          {showHomeLinks && (
  <div className="hidden lg:flex items-center gap-2">
    {[
      { label: "Bookings", to: "/bookings" },
      { label: "Job Progress", to: "/jobprogress" },
      { label: "About", to: "/about" },
      { label: "Privacy", to: "/privacy" },
      { label: "Help", to: "/help" },
    ].map((link) => (
      <Link
        key={link.to}
        to={link.to}
        className="px-4 py-2 text-sm font-medium rounded-full transition-all
                   text-gray-700 hover:text-blue-600 
                   hover:bg-blue-50 hover:shadow-sm"
      >
        {link.label}
      </Link>
    ))}
  </div>
)}

          {/* Right Button (Sign In / Sign Up) */}
          {rightButton && (
            <Link
              to={rightButton.to}
              className={`${
                rightButton.variant === "primary"
                  ? "btn-primary text-sm px-6 py-2.5"
                  : "btn-link text-sm"
              }`}
            >
              {rightButton.label}
            </Link>
          )}

          {/* User Controls */}
          {showUserControls && customerData?.user && (
            <>
              <CommonNotificationFloater />
              <img
                onClick={() => navigate("/profile")}
                src={profilePic || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"}
                alt="User"
                className="w-10 h-10 rounded-xl object-cover cursor-pointer border-2 border-transparent hover:border-blue-600 hover:scale-105 hover:shadow-md"
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default CommonNavbar;