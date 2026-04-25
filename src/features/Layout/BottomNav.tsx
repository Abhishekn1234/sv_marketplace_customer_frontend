import React from "react";
import clsx from "clsx";
import { useAuthStore } from "../core/store/auth";
import { useNavigate } from "react-router-dom";
import CommonNotificationFloater from "@/components/common/CommonNotificationFloater";

const BottomNav: React.FC = () => {
  const { user } = useAuthStore();
  const userphoto = user?.profilePictureUrl;
  const navigate = useNavigate();

  return (
    <nav
      aria-label="Main navigation"
      className="
        fixed bottom-6 left-1/2 -translate-x-1/2
        w-[90%] sm:w-auto
        flex items-center justify-around sm:justify-center
        gap-1 sm:gap-2
        bg-white/95 backdrop-blur-md
        px-3 py-2 sm:px-4
        rounded-3xl
        shadow-xl
        border border-white/50
        z-[100]
      "
    >
      <NavItem ariaLabel="Home" tooltip="Home" onClick={() => navigate("/")}>
        <HomeIcon />
      </NavItem>

      <NavItem ariaLabel="About" tooltip="About" onClick={() => navigate("/about")}>
        <AboutIcon />
      </NavItem>

      <NavItem ariaLabel="Notifications" tooltip="Notifications">
        <CommonNotificationFloater direction="up" />
      </NavItem>

      <NavItem ariaLabel="Bookings" tooltip="Bookings" onClick={() => navigate("/bookings")}>
        <BookingIcon />
      </NavItem>

      <NavItem ariaLabel="Profile" tooltip="Profile">
        <div onClick={() => navigate("/profile")} className="w-full h-full flex items-center justify-center">
          {userphoto ? (
            <img
              src={userphoto}
              alt="Profile"
              className="
                w-9 h-9 sm:w-10 sm:h-10
                rounded-xl object-cover
                border-2 border-transparent
                transition-all duration-200
                group-hover:border-blue-600
                group-hover:scale-110
              "
            />
          ) : (
            <UserIcon />
          )}
        </div>
      </NavItem>
    </nav>
  );
};

/* ================= NAV ITEM ================= */

interface NavItemProps {
  children: React.ReactNode;
  ariaLabel: string;
  tooltip?: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  children,
  ariaLabel,
  tooltip,
  onClick,
}) => {
  const baseClass = clsx(`
    group relative
    w-11 h-11 sm:w-10 sm:h-10
    flex items-center justify-center
    rounded-xl
    transition-all duration-200
    hover:bg-gray-100
    hover:-translate-y-0.5
    focus:outline-none
    cursor-pointer
  `);

  return (
    <div className="relative group">
      {/* Tooltip */}
      {tooltip && (
        <span
          className="
            absolute -top-9 left-1/2 -translate-x-1/2
            px-2 py-1 text-xs
            bg-black text-white rounded-md
            opacity-0 group-hover:opacity-100
            transition
            pointer-events-none
            whitespace-nowrap
            z-50
          "
        >
          {tooltip}
        </span>
      )}

      {/* Button / div */}
      {onClick ? (
        <button aria-label={ariaLabel} onClick={onClick} className={baseClass}>
          {children}
        </button>
      ) : (
        <div aria-label={ariaLabel} className={baseClass}>
          {children}
        </div>
      )}
    </div>
  );
};

/* ================= ICONS ================= */

const iconBase = "w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200";

const HomeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`${iconBase} text-blue-600`}
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const AboutIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`${iconBase} text-gray-400 group-hover:text-gray-600`}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const BookingIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`${iconBase} text-gray-400 group-hover:text-gray-600`}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

/* ================= USER ICON ================= */

const UserIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`${iconBase} text-gray-500`}
  >
    <path d="M20 21a8 8 0 10-16 0" />
    <circle cx="12" cy="8" r="4" />
  </svg>
);

export default BottomNav;