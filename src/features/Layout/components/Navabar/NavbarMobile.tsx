'use client';

import React from "react";
import { Link } from "react-router-dom";


import { useAuthStore } from "@/features/core/store/auth";
import { useSearchStore } from "@/features/core/store/auth";
import { useLanguage } from "@/features/context/LanguageContext";


import { toast } from "react-toastify";
import Select from "@/components/input/Select";
import { languages } from "../../../../components/common/languages";
import { Input } from "@/components/input";
import { SearchIcon } from "@/components/icons";


interface NavbarMobileProps {
  showSearch: boolean;
  showMobileSearch: boolean;
  setShowMobileSearch: (show: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  rightButton?: {
    label: string;
    to: string;
    variant?: "primary" | "link";
  };
  navLinks: Array<{
    icon: React.ElementType;
    label: string;
    to: string;
  }>;
}

const NavbarMobile: React.FC<NavbarMobileProps> = ({
  showSearch,
  showMobileSearch,
//   setShowMobileSearch,
  mobileMenuOpen,
  setMobileMenuOpen,
  rightButton,
  navLinks,
}) => {
  const { searchTerm, setSearchTerm } = useSearchStore();
  const { t } = useLanguage();
  const user = useAuthStore((state) => state.user);
  const language = useAuthStore((state) => state.language);
  const setLanguage = useAuthStore((state) => state.setLanguage);

  const handleChange = (code: string, label: string) => {
    setLanguage(code);
    toast.success(`Language changed to ${label}`);
  };

  return (
    <>
      {/* Mobile Search Bar */}
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
            <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
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
                    handleChange(selectedLanguage.code, selectedLanguage.label);
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
    </>
  );
};

export default NavbarMobile;