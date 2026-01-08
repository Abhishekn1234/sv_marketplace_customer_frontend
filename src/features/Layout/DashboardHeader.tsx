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
import { Button } from "../components/ui/button";
import { useTheme } from "../context/themeContext";

interface Props {
  onLogout: () => void;
}

export default function DashboardHeader({ onLogout }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [languageOpen, setLanguageOpen] = useState(false);

  /* USER INITIALS */
  const raw = localStorage.getItem("customerData");
  let initials = "??";
  if (raw) {
    try {
      const { fullName } = JSON.parse(raw);
      if (fullName) {
        initials = fullName
          .split(" ")
          .map((n: string) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();
      }
    } catch {}
  }

  const menu = [
    { label: "My Bookings", path: "/my-bookings", icon: Calendar },
    { label: "Profile", path: "/profile", icon: User },
  ];

  const languages = ["EN", "HI", "AR","UR"];

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 border-b",
        theme === "dark"
          ? "bg-gray-900 border-gray-800"
          : "bg-white border-gray-200"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        {/* LOGO */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-9 h-9 bg-blue-600 text-white rounded-md flex items-center justify-center font-bold">
            {initials}
          </div>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-4">
          {menu.map((m) => {
            const Icon = m.icon;
            const active = location.pathname === m.path;
            return (
              <button
                key={m.path}
                onClick={() => navigate(m.path)}
                className={clsx(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
                  active
                    ? "text-blue-500"
                    : theme === "dark"
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-blue-600"
                )}
              >
                <Icon className="w-4 h-4" />
                {m.label}
              </button>
            );
          })}

          {/* THEME */}
          <Button variant="ghost" onClick={toggleTheme}>
            {theme === "light" ? <Moon /> : <Sun />}
          </Button>

          {/* LANGUAGE */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setLanguageOpen(!languageOpen)}
              className="flex items-center gap-1"
            >
              <Globe size={16} /> {language}
            </Button>

            {languageOpen && (
              <div
                className={clsx(
                  "absolute right-0 mt-1 rounded border min-w-[80px]",
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                )}
              >
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setLanguageOpen(false);
                    }}
                    className={clsx(
                      "block w-full px-3 py-2 text-left text-sm",
                      theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* LOGOUT */}
          <Button
            variant="ghost"
            onClick={() => {
              localStorage.removeItem("customerData");
              onLogout();
              navigate("/login");
            }}
          >
            <LogOut className="text-red-500" />
          </Button>
        </div>

        {/* MOBILE TOGGLE */}
        <Button
          size="icon"
          variant="ghost"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div
          className={clsx(
            "md:hidden px-4 py-4 border-t",
            theme === "dark" ? "border-gray-800" : "border-gray-200"
          )}
        >
          {menu.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.path}
                onClick={() => {
                  navigate(m.path);
                  setMobileOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 rounded-md"
              >
                <Icon className="w-4 h-4" />
                {m.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
