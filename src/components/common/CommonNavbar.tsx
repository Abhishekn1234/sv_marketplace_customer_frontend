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
} from "lucide-react";

import CommonNotificationFloater from "@/components/common/CommonNotificationFloater";
import { useAuthStore, useSearchStore } from "@/features/core/store/auth";
import { useUpdateCurrentLocation } from "@/features/Auth/presentation/components/Location/presentation/hooks/useCurrentlocation";
import { useLanguage } from "@/features/context/LanguageContext";

import { UserIcon } from "../icons";
import { Image, Input } from "../input";
import Button from "../input/Button";
import OnboardingChecklist from "./OnboardingCheckList";
import Select from "../input/Select";
import { languages } from "./languages";
import { toast } from "react-toastify";

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
  showHomeLinks = false,
}) => {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { isRTLOrder } = useLanguage();
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

  const language = useAuthStore((state) => state.language);
  const setLanguage = useAuthStore((state) => state.setLanguage);

  const handleChange = (code: string, label: string) => {
    setLanguage(code);
    toast.success(`Language changed to ${label}`);
  };

  const notificationRef = useRef<HTMLDivElement | null>(null);

  const currentLocation =
    location.find((addr) => addr.type === "home")?.value ||
    location.find((addr) => addr.type === "inputValue")?.value;

  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const hasLocation = Boolean(
    current_location?.lat != null &&
      current_location?.lng != null &&
      currentLocation?.trim()
  );

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

  const isBookingPage = routerLocation.pathname === "/bookings";
  const isHomePage = routerLocation.pathname === "/";
  const serviceRatingPage = routerLocation.pathname === "/servicerating";
  const jobProgressPage = routerLocation.pathname.startsWith("/jobprogress/");
  const jobTrackingPage = routerLocation.pathname.startsWith("/jobtracking/");
  const jobCompletePage = routerLocation.pathname === "/jobcompleted";

  const isTransparentPage =
    isBookingPage ||
    isHomePage ||
    serviceRatingPage ||
    jobProgressPage ||
    jobTrackingPage ||
    jobCompletePage;

  const showLocationSection =
    showLocation ||
    isHomePage ||
    isBookingPage ||
    serviceRatingPage ||
    jobProgressPage ||
    jobTrackingPage;

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowMobileSearch(false);
  }, [routerLocation.pathname]);

  const navLinks = [
    { icon: BookOpen, label: t.navbar.Bookings, to: "/bookings" },
    { icon: Info, label: t.navbar.About, to: "/about" },
    { icon: Shield, label: t.navbar.Privacy, to: "/privacy" },
    { icon: HelpCircle, label: t.navbar.Help, to: "/help" },
  ];

  return (
    <>
      <header
        className={`top-0 z-50 w-full relative ${
          isTransparentPage
            ? "bg-transparent shadow-none"
            : "bg-white border-b border-gray-200 shadow-sm"
        }`}
        dir={isRTLOrder ? "rtl" : "ltr"}
      >
        {/* ── MAIN NAV ROW ── */}
        <div
          className={`flex items-center h-14 sm:h-16 px-3 sm:px-5 lg:px-8 gap-2 ${
            isTransparentPage ? "max-w-7xl mx-auto" : "w-full"
          } justify-between`}
        >
          {/* ── LEFT: Logo + Location / Back ── */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {/* Logo */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
              aria-label="Go to home"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shrink-0">
                <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-white">
                  <path d="M12 2.1L2 9.6v11.3h8.2v-6.5h3.6v6.5H22V9.6L12 2.1z" />
                </svg>
              </div>
              <span className="hidden sm:block font-bold text-base lg:text-lg text-gray-900 whitespace-nowrap">
                {title}
              </span>
            </button>

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
                className="relative flex flex-col min-w-0 flex-1 max-w-[160px] xs:max-w-[180px] sm:max-w-[220px] md:max-w-xs"
              >
                <Input
                  variant="unstyled"
                  onClick={() => setShowDropdown((prev) => !prev)}
                  value={currentLocation || ""}
                  readOnly
                  placeholder={!currentLocation ? "Select location" : ""}
                  className="cursor-pointer px-0 py-0 placeholder:text-gray-400 truncate w-full text-sm sm:text-base"
                  rightElement={
                    !currentLocation ? (
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
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
                      <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                      {t.navbar["Use current location"]}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT: Controls ── */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 shrink-0">
            {/* Desktop nav links */}
            {showHomeLinks && (
              <nav className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="px-3 py-1.5 text-sm font-medium rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition whitespace-nowrap"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}

            {/* Desktop search */}
            {showSearch && (
              <>
                {/* Expanded on md+ */}
                <div className="hidden md:flex items-center relative">
                  <Input
                    value={searchTerm}
                    onChange={(value) => setSearchTerm(value)}
                    placeholder={t.navbar.SearchPlaceholder}
                    className="pl-9 bg-white w-36 lg:w-56 xl:w-64 text-sm"
                    size="md"
                    radius="lg"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                </div>

                {/* Icon-only toggle on small screens */}
                <Button
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
                  onClick={() => setShowMobileSearch((prev) => !prev)}
                  aria-label="Toggle search"
                >
                  {showMobileSearch ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </Button>
              </>
            )}

            {/* Language selector — hidden on mobile, shown sm+ */}
          {user && (
  <div className="hidden sm:block">
    <Select
      value={language}
      onChange={(code) => {
        const selectedLanguage = languages.find(
          (lang) => lang.code === code
        );
        if (!selectedLanguage) return;
        handleChange(selectedLanguage.code, selectedLanguage.label);
      }}
      options={languages.map((lang) => ({
        label: lang.label,
        value: lang.code,
        icon: <span className="text-lg">{lang.flag}</span>,
      }))}
      size="sm"
      variant="ghost"
    />
  </div>
)}

            {/* CTA button */}
            {rightButton && (
              <Link
                to={rightButton.to}
                className="hidden sm:flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 text-blue-600 border-2 border-blue-600 rounded-full text-sm font-semibold hover:bg-blue-600 hover:text-white transition whitespace-nowrap"
              >
                {rightButton.label}
              </Link>
            )}

            {/* User controls: notifications + avatar */}
            {showUserControls && user && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div ref={notificationRef}>
                  <CommonNotificationFloater />
                </div>

                <Image
                  src={profilePic}
                  alt="Profile"
                  onClick={() => navigate("/profile")}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover cursor-pointer hover:scale-105 transition"
                  fallback={
                    <div
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => navigate("/profile")}
                    >
                      <UserIcon />
                    </div>
                  }
                />
              </div>
            )}

            {/* Mobile hamburger — always shown on mobile (language lives in drawer);
                on desktop only shown when showHomeLinks is true */}
            <Button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition text-gray-700"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* ── MOBILE SEARCH BAR (expands below nav row) ── */}
        {showSearch && showMobileSearch && (
          <div className="md:hidden border-t bg-white px-3 py-2.5 animate-fadeIn">
            <div className="relative">
              <Input
                value={searchTerm}
                onChange={(value) => setSearchTerm(value)}
                placeholder={t.navbar.SearchPlaceholder}
                className="pl-9 w-full text-sm"
                size="md"
                radius="lg"
                autoFocus
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

        {/* ── MOBILE MENU ── */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t bg-white shadow-md">
            <nav className="flex flex-col p-3 gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition text-sm font-medium"
                  >
                    <Icon className="w-4 h-4 shrink-0 text-gray-400" />
                    {item.label}
                  </Link>
                );
              })}
             {user && (
  <div className="border-t border-gray-100 mt-1 pt-2">
    <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
      {t.language.title}
    </p>

    <Select
      value={language}
      onChange={(code) => {
        const selectedLanguage = languages.find(
          (lang) => lang.code === code
        );
        if (!selectedLanguage) return;

        handleChange(
          selectedLanguage.code,
          selectedLanguage.label
        );

        setMobileMenuOpen(false);
      }}
      options={languages.map((lang) => ({
        label: lang.label,
        value: lang.code,
        icon: <span className="text-lg">{lang.flag}</span>,
      }))}
      size="sm"
      variant="ghost"
    />
  </div>
)}

              {/* Mobile CTA button */}
              {rightButton && (
                <Link
                  to={rightButton.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-1 flex items-center justify-center px-4 py-2 text-blue-600 border-2 border-blue-600 rounded-full text-sm font-semibold hover:bg-blue-600 hover:text-white transition"
                >
                  {rightButton.label}
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default CommonNavbar;