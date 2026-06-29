'use client';

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";


import { useAuthStore } from "@/features/core/store/auth";
import { useUpdateCurrentLocation } from "@/features/Auth/presentation/components/Location/presentation/hooks/useCurrentlocation";
import { useLanguage } from "@/features/context/LanguageContext";
import Button from "@/components/input/Button";
import { Input } from "@/components/input";
import OnboardingChecklist from "../../../../components/common/OnboardingCheckList";
import { LogoIcon, MapPinIcon } from "@/components/icons";




interface NavbarLeftProps {
  showBackButton?: boolean;
  showLocation?: boolean;
  title?: string;
  isTransparentPage?: boolean;
  isBookingPage?: boolean;
  isHomePage?: boolean;
  serviceRatingPage?: boolean;
  showLocationSection?: boolean;
}

const NavbarLeft: React.FC<NavbarLeftProps> = ({
  showBackButton = false,
//   showLocation = false,
  title = "HomeEase",
//   isTransparentPage = false,
  isBookingPage = false,
//   isHomePage = false,
  serviceRatingPage = false,
  showLocationSection = false,
}) => {
  const navigate = useNavigate();
  const { isRTLOrder } = useLanguage();
  const { current_location } = useAuthStore();
  const { handleUseCurrentLocation } = useUpdateCurrentLocation();
  const { t } = useLanguage();

  const location = current_location?.addresses ?? [];
  const currentLocation =
    location.find((addr) => addr.type === "home")?.value ||
    location.find((addr) => addr.type === "inputValue")?.value;

  const hasLocation = Boolean(
    current_location?.lat != null &&
      current_location?.lng != null &&
      currentLocation?.trim()
  );

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
  const [showDropdown, setShowDropdown] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const hasNotificationsEnabled = true;
  const stepCompletion = {
    location: hasLocation,
    notifications: hasNotificationsEnabled,
  };
  const allStepsDone = ONBOARDING_STEPS.every((step) => stepCompletion[step.id]);

  useEffect(() => {
    const isLocationEmpty = !currentLocation?.trim();
    setShowOnboarding(isLocationEmpty);
  }, [currentLocation]);

  useEffect(() => {
    if (allStepsDone && showOnboarding) {
      const timer = setTimeout(() => {
        localStorage.setItem("location-onboarding-seen", "true");
        setShowOnboarding(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [allStepsDone, showOnboarding]);

  const dismissOnboarding = () => {
    localStorage.setItem("location-onboarding-seen", "true");
    setShowOnboarding(false);
  };

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
    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
      {/* Logo */}
      <Button
        onClick={() => navigate("/")}
        leftIcon={
          <>
          <LogoIcon />
          </>
        }
        className="flex items-center gap-2 cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
        aria-label="Go to home"
      >
       
        <span className="hidden sm:block font-bold text-base lg:text-lg text-gray-900 whitespace-nowrap">
          {title}
        </span>
      </Button>

      {/* Back Button */}
      {showBackButton && (
        <Button
          onClick={() => navigate(-1)}
          className="px-2 sm:px-3 py-1.5 bg-gray-50 border rounded-xl text-sm font-semibold hover:border-blue-600 hover:bg-blue-50 transition whitespace-nowrap shrink-0"
        >
          {t.navbar.Back}
        </Button>
      )}

      {/* Location picker */}
      {showLocationSection && (
        <div
          ref={dropdownRef}
          className="
            relative flex flex-col min-w-0 flex-1
            max-w-full
            sm:max-w-[320px]
            md:max-w-xs
          "
        >
          <Input
            variant="unstyled"
            onClick={() => setShowDropdown((prev) => !prev)}
            value={currentLocation || ""}
            readOnly
            title={currentLocation || ""}
            placeholder={!currentLocation ? "Select location" : ""}
            className="
              cursor-pointer
              px-0 py-0
              w-full
              text-sm sm:text-base
              placeholder:text-gray-400
            "
            rightElement={
              !currentLocation ? (
                <MapPinIcon className="w-4 h-4 text-gray-400 shrink-0" />
              ) : null
            }
          />

          {/* Onboarding tooltip */}
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

          {/* Location dropdown */}
          {showDropdown && (
            <div
              className={`
                absolute top-full mt-2 z-[9999]
                w-56 sm:w-64 md:w-72
                bg-white border border-gray-200
                rounded-xl shadow-xl overflow-hidden
                animate-fadeIn
                ${
                  isBookingPage || serviceRatingPage
                    ? "left-1/2 -translate-x-1/2"
                    : isRTLOrder
                    ? "right-0"
                    : "left-0"
                }
              `}
            >
              <Button
                onClick={handleUseCurrentLocation}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 active:bg-blue-100 transition-colors rounded-none"
              >
                <MapPinIcon className="w-4 h-4 text-blue-500 shrink-0" />
                {t.navbar["Use current location"]}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarLeft;