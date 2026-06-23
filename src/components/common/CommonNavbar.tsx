'use client';

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  BookOpen,
  Info,
  Shield,
  HelpCircle,
} from "lucide-react";

import { useLanguage } from "@/features/context/LanguageContext";
import NavbarLeft from "../../features/Layout/components/Navabar/NavbarLeft";
import NavbarRight from "../../features/Layout/components/Navabar/NavbarRight";
import NavbarMobile from "../../features/Layout/components/Navabar/NavbarMobile";



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
  const routerLocation = useLocation();
  const { isRTLOrder } = useLanguage();
  const { t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

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

  const navLinks = [
    { icon: BookOpen, label: t.navbar.Bookings, to: "/bookings" },
    { icon: Info, label: t.navbar.About, to: "/about" },
    { icon: Shield, label: t.navbar.Privacy, to: "/privacy" },
    { icon: HelpCircle, label: t.navbar.Help, to: "/help" },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowMobileSearch(false);
  }, [routerLocation.pathname]);

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
        {/* MAIN NAV ROW */}
        <div
          className={`flex items-center h-14 sm:h-16 px-3 sm:px-5 lg:px-8 gap-2 ${
            isTransparentPage ? "max-w-7xl mx-auto" : "w-full"
          } justify-between`}
        >
          {/* Left Section */}
          <NavbarLeft
            showBackButton={showBackButton}
            showLocation={showLocation}
            title={title}
            isTransparentPage={isTransparentPage}
            isBookingPage={isBookingPage}
            isHomePage={isHomePage}
            serviceRatingPage={serviceRatingPage}
            showLocationSection={showLocationSection}
          />

          {/* Right Section */}
          <NavbarRight
            showSearch={showSearch}
            rightButton={rightButton}
            showUserControls={showUserControls}
            showHomeLinks={showHomeLinks}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            showMobileSearch={showMobileSearch}
            setShowMobileSearch={setShowMobileSearch}
            navLinks={navLinks}
          />
        </div>

        {/* Mobile Components */}
        <NavbarMobile
          showSearch={showSearch}
          showMobileSearch={showMobileSearch}
          setShowMobileSearch={setShowMobileSearch}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          rightButton={rightButton}
          navLinks={navLinks}
        />
      </header>
    </>
  );
};

export default CommonNavbar;