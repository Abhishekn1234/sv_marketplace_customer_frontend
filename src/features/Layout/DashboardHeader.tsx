import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Calendar,
  User,
  LogOut,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import clsx from "clsx";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "../core/store/auth";

export default function DashboardHeader({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  const customerData = useAuthStore((s) => s.customerData);
  const toggleTheme = useAuthStore((s) => s.toggleTheme);
  const setLanguage = useAuthStore((s) => s.setLanguage);

  const { user, theme, language } = customerData;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "??";

  const menu = [
    { label: "My Bookings", path: "/my-bookings", icon: Calendar },
    { label: "Profile", path: "/profile", icon: User },
  ];

  const languages = ["EN", "HI", "AR", "UR"];

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 border-b transition-colors",
        theme === "dark"
          ? "bg-gray-900 border-gray-800 text-gray-100"
          : "bg-white border-gray-200 text-gray-800"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-md bg-blue-600 text-white font-bold flex items-center justify-center">
            {initials}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {menu.map((m) => {
            const Icon = m.icon;
            const active = location.pathname === m.path;

            return (
              <Button
                key={m.path}
                variant={active ? "secondary" : "ghost"}
                onClick={() => navigate(m.path)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                <Label>{m.label}</Label>
              </Button>
            );
          })}

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setLanguageOpen(!languageOpen)}
              className="flex items-center gap-2"
            >
              <Globe size={16} />
              <Label>{language}</Label>
            </Button>

            {languageOpen && (
              <div
                className={clsx(
                  "absolute right-0 mt-2 w-24 rounded-md border shadow-md",
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                )}
              >
                {languages.map((lang) => (
                  <Button
                    key={lang}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setLanguage(lang);
                      setLanguageOpen(false);
                    }}
                  >
                    <Label>{lang}</Label>
                  </Button>
                ))}
              </div>
            )}
          </div>

          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              onLogout();
              navigate("/login");
            }}
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {mobileOpen && (
        <div
          className={clsx(
            "md:hidden px-4 py-3 space-y-2 border-t",
            theme === "dark"
              ? "bg-gray-900 border-gray-800"
              : "bg-white border-gray-200"
          )}
        >
          {menu.map((m) => {
            const Icon = m.icon;
            return (
              <Button
                key={m.path}
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => {
                  navigate(m.path);
                  setMobileOpen(false);
                }}
              >
                <Icon className="w-4 h-4" />
                <Label>{m.label}</Label>
              </Button>
            );
          })}
        </div>
      )}
    </header>
  );
}
