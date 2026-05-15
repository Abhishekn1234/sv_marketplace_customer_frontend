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
  CheckCircle2,
  // Circle,
} from "lucide-react";

import CommonNotificationFloater from "@/components/common/CommonNotificationFloater";
import { useAuthStore, useSearchStore } from "@/features/core/store/auth";
import { useUpdateCurrentLocation } from "@/features/Auth/presentation/components/Location/presentation/hooks/useCurrentlocation";
import { useLanguage } from "@/features/context/LanguageContext";

import { UserIcon } from "../icons";
import { Image, Input } from "../input";
import Button from "../input/Button";

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
const ONBOARDING_STEPS = [
  {
    id: "location",
    label: "Set your location",
    description: "Required for nearby services",
  },
] as const;

type OnboardingStepId = (typeof ONBOARDING_STEPS)[number]["id"];

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

  const currentLocation =
    location.find((addr) => addr.type === "home")?.value ||
    location.find((addr) => addr.type === "inputValue")?.value;

  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const hasLocation =
    current_location?.lat != null &&
    current_location?.lng != null &&
    currentLocation?.trim() !== "";

  // Derive per-step completion from real state
  const stepCompletion: Record<OnboardingStepId, boolean> = {
    location: hasLocation,
  };

  const allStepsDone = ONBOARDING_STEPS.every(
    (step) => stepCompletion[step.id]
  );

  // Show onboarding if any step is incomplete and the user hasn't dismissed it
  useEffect(() => {
    const dismissed = localStorage.getItem("location-onboarding-seen");
    if (!dismissed) {
      setShowOnboarding(true);
    }
  }, []);

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
          className={`flex items-center py-3 px-4 sm:px-6 lg:px-8 ${
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
          <div className="flex items-center gap-4 min-w-0">
            {/* LOGO */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M12 2.1L2 9.6v11.3h8.2v-6.5h3.6v6.5H22V9.6L12 2.1z" />
                </svg>
              </div>
              <span className="hidden sm:block font-bold text-lg text-gray-900">
                {title}
              </span>
            </div>

            {/* LOCATION + ONBOARDING */}
            {(showLocation ||
              isHomePage ||
              isBookingPage ||
              serviceRatingPage ||
              jobProgressPage ||
              jobTrackingPage) && (
              <div ref={dropdownRef} className="ml-3 relative flex flex-col">
                {/* LOCATION INPUT */}
                <Input
                  variant="unstyled"
                  onClick={() => setShowDropdown((prev) => !prev)}
                  value={currentLocation || ""}
                  readOnly
                  placeholder={!currentLocation ? "Select location" : ""}
                  className="cursor-pointer px-0 py-0 placeholder:text-gray-400"
                  rightElement={
                    !currentLocation ? (
                      <MapPin className="w-4 h-4 text-gray-400" />
                    ) : null
                  }
                />

                {/* ONBOARDING CHECKLIST */}
                {showOnboarding && (
                  <div className="absolute top-full mt-3 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 z-[9999]">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {allStepsDone ? "You're all set! 🎉" : "Complete setup"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {allStepsDone
                            ? "Setup complete, closing shortly…"
                            : `${
                                ONBOARDING_STEPS.filter(
                                  (s) => stepCompletion[s.id]
                                ).length
                              } of ${ONBOARDING_STEPS.length} steps done`}
                        </p>
                      </div>
                      <Button
                        onClick={dismissOnboarding}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (ONBOARDING_STEPS.filter(
                              (s) => stepCompletion[s.id]
                            ).length /
                              ONBOARDING_STEPS.length) *
                            100
                          }%`,
                        }}
                      />
                    </div>

                    {/* Step list */}
                    <div className="space-y-2">
                      {ONBOARDING_STEPS.map((step, index) => {
                        const done = stepCompletion[step.id];
                        return (
                          <div
                            key={step.id}
                            className={`flex items-center justify-between rounded-xl p-3 transition-colors ${
                              done ? "bg-green-50" : "bg-blue-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {/* Step icon: check when done, numbered circle when pending */}
                              {done ? (
                                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                  {index + 1}
                                </div>
                              )}
                              <div>
                                <p
                                  className={`text-sm font-medium ${
                                    done
                                      ? "text-green-700 line-through"
                                      : "text-gray-800"
                                  }`}
                                >
                                  {step.label}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {step.description}
                                </p>
                              </div>
                            </div>

                            {/* Action button only for incomplete steps */}
                            {!done && step.id === "location" && (
                              <Button
                                onClick={handleUseCurrentLocation}
                                className="px-3 py-1 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700 shrink-0"
                              >
                                Use
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* LOCATION DROPDOWN */}
                {showDropdown && (
                  <div
                    className={`
                      absolute top-full mt-2 w-56
                      bg-white border border-gray-300
                      rounded-xl shadow-2xl z-[9999]
                      backdrop-blur-md
                      ${
                        isBookingPage || serviceRatingPage
                          ? "left-1/2 -translate-x-1/2"
                          : "left-0"
                      }
                    `}
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
                className="px-3 py-2 bg-gray-50 border rounded-xl text-sm font-semibold hover:border-blue-600 hover:bg-blue-50 transition"
              >
                {t.navbar.Back}
              </Button>
            )}
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-3">
            {rightButton && (
              <Link
                to={rightButton.to}
                className="hidden sm:flex items-center justify-center px-5 py-2 text-blue-600 border-2 border-blue-600 rounded-full text-sm font-semibold hover:bg-blue-600 hover:text-white transition"
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
                    className="px-4 py-2 text-sm font-medium rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {showSearch && (
              <div className="hidden md:flex items-center relative">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.navbar.SearchPlaceholder}
                  className="pl-10 bg-white"
                  size="md"
                  radius="lg"
                  rightElement={null}
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3" />
              </div>
            )}

            {showUserControls && user && (
              <>
                <CommonNotificationFloater />
                <Image
                  src={profilePic}
                  alt="Profile"
                  onClick={() => navigate("/profile")}
                  className="w-10 h-10 rounded-xl object-cover cursor-pointer hover:scale-105 transition"
                  fallback={
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
                      onClick={() => navigate("/profile")}
                    >
                      <UserIcon />
                    </div>
                  }
                />
              </>
            )}

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

        {/* MOBILE MENU */}
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

              {rightButton && (
                <Link
                  to={rightButton.to}
                  className="w-full flex justify-center px-6 py-3 mt-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
                >
                  {rightButton.label}
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default CommonNavbar;