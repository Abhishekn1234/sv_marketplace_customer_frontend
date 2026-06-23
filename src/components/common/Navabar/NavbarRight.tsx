'use client';

import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, Menu } from "lucide-react";

import CommonNotificationFloater from "@/components/common/CommonNotificationFloater";
import { useAuthStore, useSearchStore } from "@/features/core/store/auth";
import { useLanguage } from "@/features/context/LanguageContext";

import { toast } from "react-toastify";
import { Input } from "@/components/input";
import Button from "@/components/input/Button";
import { languages } from "../languages";
import Select from "@/components/input/Select";
import { UserIcon } from "@/components/icons";
import { Image } from "@/components/input"; // ✅ FIXED MISSING IMPORT

interface NavbarRightProps {
  showSearch?: boolean;
  rightButton?: {
    label: string;
    to: string;
    variant?: "primary" | "link";
  };
  showUserControls?: boolean;
  showHomeLinks?: boolean;

  // ✅ FIX: correct React setter types
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;

  showMobileSearch: boolean;
  setShowMobileSearch: React.Dispatch<React.SetStateAction<boolean>>;

  navLinks: Array<{
    icon: React.ElementType;
    label: string;
    to: string;
  }>;
}

const NavbarRight: React.FC<NavbarRightProps> = ({
  showSearch = false,
  rightButton,
  showUserControls = true,
  showHomeLinks = false,
  mobileMenuOpen,
  setMobileMenuOpen,
  showMobileSearch,
  setShowMobileSearch,
  navLinks,
}) => {
  const { user } = useAuthStore();
  const { searchTerm, setSearchTerm } = useSearchStore();
  const { t } = useLanguage();
  const language = useAuthStore((state) => state.language);
  const setLanguage = useAuthStore((state) => state.setLanguage);
  const navigate = useNavigate();
  const notificationRef = useRef<HTMLDivElement | null>(null);

  const profilePic = user?.profilePictureUrl;

  const handleChange = (code: string, label: string) => {
    setLanguage(code);
    toast.success(`Language changed to ${label}`);
  };

  return (
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

          {/* Mobile search toggle */}
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

      {/* Language selector */}
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

      {/* User controls */}
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

      {/* Mobile hamburger */}
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
  );
};

export default NavbarRight;