'use client';

import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  BookOpen,
  Info,
  Shield,
  HelpCircle,
  MapPin,
  // CheckCircle2,
  // Circle,
} from "lucide-react";

import CommonNotificationFloater from "@/components/common/CommonNotificationFloater";
import { useAuthStore, useSearchStore } from "@/features/core/store/auth";
import { useUpdateCurrentLocation } from "@/features/Auth/presentation/components/Location/presentation/hooks/useCurrentlocation";
import { useLanguage } from "@/features/context/LanguageContext";

import { UserIcon } from "../icons";
import { Image, Input } from "../input";
import Button from "../input/Button";
import OnboardingChecklist from "./OnboardingCheckList";

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

// Onboarding steps definition — extend this array to add more steps



const CommonNavbar: React.FC<NavbarProps> = ({
  showBackButton = false,
  showSearch = false,
  showLocation = false,
  title = "HomeEase",
  rightButton,
  showUserControls = true,
  showHomeLinks = false,
}) => {
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const { user, current_location } = useAuthStore();
  const { searchTerm, setSearchTerm } = useSearchStore();
  const { handleUseCurrentLocation } = useUpdateCurrentLocation();
  const { t } = useLanguage();

  const profilePic = user?.profilePictureUrl;

  const location = current_location?.addresses ?? [];
 const ONBOARDING_STEPS = [
  {
    id: "location",
    label: t.onboarding.location.label,
    description: t.onboarding.location.description,
  },
  {
    id: "notifications",
    label: t.onboarding.notifications.label,
    description: t.onboarding.notifications.description,
  },
] as const;
const notificationRef = useRef<HTMLDivElement | null>(null);


  const currentLocation =
    location.find((addr) => addr.type === "home")?.value ||
    location.find((addr) => addr.type === "inputValue")?.value;

  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

 const hasLocation = Boolean(
  current_location?.lat != null &&
    current_location?.lng != null &&
    currentLocation?.trim()
);

  // Derive per-step completion from real state
const hasNotificationsEnabled = true; // replace with real API/state

const stepCompletion = {
  location: hasLocation,
  notifications: hasNotificationsEnabled,
};

  const allStepsDone = ONBOARDING_STEPS.every(
    (step) => stepCompletion[step.id]
  );

  // Show onboarding if any step is incomplete and the user hasn't dismissed it
 useEffect(() => {
  const isLocationEmpty = !currentLocation?.trim();

  setShowOnboarding(isLocationEmpty);
}, [currentLocation]);
  // Auto-dismiss once every step is complete
  useEffect(() => {
    if (allStepsDone && showOnboarding) {
      const timer = setTimeout(() => {
        localStorage.setItem("location-onboarding-seen", "true");
        setShowOnboarding(false);
      }, 1500); // brief delay so user sees the final checkmark
      return () => clearTimeout(timer);
    }
  }, [allStepsDone, showOnboarding]);

  const dismissOnboarding = () => {
    localStorage.setItem("location-onboarding-seen", "true");
    setShowOnboarding(false);
  };

  const isBookingPage = routerLocation.pathname === "/bookings";
  const isHomePage = routerLocation.pathname === "/";
  const serviceRatingPage = routerLocation.pathname === "/servicerating";
  const jobProgressPage = routerLocation.pathname.startsWith("/jobprogress/");
  const jobTrackingPage = routerLocation.pathname.startsWith("/jobtracking/");
  const jobCompletePage = routerLocation.pathname === "/jobcompleted";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <header
  className={`top-0 z-50 w-full relative ${
    isBookingPage
      ? "bg-transparent shadow-none"
      : isHomePage
      ? "bg-transparent"
      : jobTrackingPage
      ? "bg-transparent shadow-none"
      : serviceRatingPage
      ? "bg-transparent shadow-none"
      : jobProgressPage
      ? "bg-transparent shadow-none"
      : jobCompletePage
      ? "bg-transparent shadow-none"
      : "bg-white border-b border-gray-200 shadow-sm"
  }`}
>
  <div
    className={`flex items-center py-3 px-3 sm:px-6 lg:px-8 gap-2 sm:gap-4 ${
      isBookingPage ||
      isHomePage ||
      serviceRatingPage ||
      jobProgressPage ||
      jobTrackingPage ||
      jobCompletePage
        ? "max-w-7xl mx-auto justify-between"
        : "w-full justify-between"
    }`}
  >
    {/* LEFT SECTION */}
    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
      {/* LOGO */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-2 cursor-pointer shrink-0"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
            <path d="M12 2.1L2 9.6v11.3h8.2v-6.5h3.6v6.5H22V9.6L12 2.1z" />
          </svg>
        </div>

        <span className="hidden sm:block font-bold text-lg text-gray-900">
          {title}
        </span>
      </div>

      {/* LOCATION SECTION */}
      {(showLocation ||
        isHomePage ||
        isBookingPage ||
        serviceRatingPage ||
        jobProgressPage ||
        jobTrackingPage) && (
        <div
          ref={dropdownRef}
          className="relative flex flex-col min-w-0 flex-1"
        >
          {/* LOCATION INPUT */}
          <Input
            variant="unstyled"
            onClick={() => setShowDropdown((prev) => !prev)}
            value={currentLocation || ""}
            readOnly
            placeholder={!currentLocation ? "Select location" : ""}
            className="cursor-pointer px-0 py-0 placeholder:text-gray-400 truncate max-w-[160px] sm:max-w-xs"
            rightElement={
              !currentLocation ? (
                <MapPin className="w-4 h-4 text-gray-400" />
              ) : null
            }
          />

          {/* ONBOARDING */}
          {showOnboarding && (
            <OnboardingChecklist
              steps={ONBOARDING_STEPS.map((step) => ({
                ...step,
                onAction:
                  step.id === "location"
                    ? handleUseCurrentLocation
                    : () =>
                        notificationRef.current?.scrollIntoView({
                          behavior: "smooth",
                        }),
                actionLabel: step.id === "location" ? "Use" : "View",
              }))}
              completion={stepCompletion}
              onClose={dismissOnboarding}
              allDone={allStepsDone}
              anchorRef={notificationRef}
            />
          )}

          {/* DROPDOWN */}
          {showDropdown && (
            <div
              className={`absolute top-full mt-2 w-52 sm:w-56 bg-white border border-gray-300 rounded-xl shadow-2xl z-[9999] ${
                isBookingPage || serviceRatingPage
                  ? "left-1/2 -translate-x-1/2"
                  : "left-0"
              }`}
            >
              <Button
                onClick={handleUseCurrentLocation}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm font-medium text-gray-700 rounded-lg"
              >
                {t.navbar["Use current location"]}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* BACK BUTTON */}
      {showBackButton && (
        <Button
          onClick={() => navigate(-1)}
          className="px-2 sm:px-3 py-2 bg-gray-50 border rounded-xl text-sm font-semibold hover:border-blue-600 hover:bg-blue-50 transition whitespace-nowrap"
        >
          {t.navbar.Back}
        </Button>
      )}
    </div>

    {/* RIGHT SECTION */}
    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
      {rightButton && (
        <Link
          to={rightButton.to}
          className="hidden sm:flex items-center justify-center px-4 sm:px-5 py-2 text-blue-600 border-2 border-blue-600 rounded-full text-sm font-semibold hover:bg-blue-600 hover:text-white transition"
        >
          {rightButton.label}
        </Link>
      )}

      {showHomeLinks && (
        <div className="hidden lg:flex items-center gap-2">
          {[
            { label: t.navbar.Bookings, to: "/bookings" },
            { label: t.navbar.About, to: "/about" },
            { label: t.navbar.Privacy, to: "/privacy" },
            { label: t.navbar.Help, to: "/help" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-2 text-sm font-medium rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* SEARCH */}
      {showSearch && (
        <div className="hidden md:flex items-center relative">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.navbar.SearchPlaceholder}
            className="pl-10 bg-white w-40 lg:w-64"
            size="md"
            radius="lg"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3" />
        </div>
      )}

      {/* USER CONTROLS */}
      {showUserControls && user && (
        <div className="flex items-center gap-2 sm:gap-3">
          <div ref={notificationRef}>
            <CommonNotificationFloater />
          </div>

          <Image
            src={profilePic}
            alt="Profile"
            onClick={() => navigate("/profile")}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover cursor-pointer hover:scale-105 transition"
            fallback={
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                <UserIcon />
              </div>
            }
          />
        </div>
      )}

      {/* MOBILE MENU BUTTON */}
      {showHomeLinks && (
        <Button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
      )}
    </div>
  </div>

  {/* MOBILE MENU (UNCHANGED) */}
  {mobileMenuOpen && (
    <div className="lg:hidden border-t bg-white shadow-md">
      <div className="flex flex-col p-4 gap-3">
        {[
          { icon: BookOpen, label: t.navbar.Bookings, to: "/bookings" },
          { icon: Info, label: t.navbar.About, to: "/about" },
          { icon: Shield, label: t.navbar.Privacy, to: "/privacy" },
          { icon: HelpCircle, label: t.navbar.Help, to: "/help" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50"
            >
              <Icon className="w-5 h-5 text-gray-400" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  )}
</header>
    </>
  );
};

export default CommonNavbar;