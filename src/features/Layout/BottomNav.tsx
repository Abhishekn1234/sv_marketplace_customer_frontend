import React from "react";
import clsx from "clsx";
import { useAuthStore } from "../core/store/auth";
import { useNavigate } from "react-router-dom";
import CommonNotificationFloater from "@/components/common/CommonNotificationFloater";

const BottomNav: React.FC = () => {
  const { customerData } = useAuthStore();
  const userphoto = customerData.user?.profilePictureUrl;
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
      <NavItem active ariaLabel="Home" onClick={() => navigate("/")}>
        <HomeIcon />
      </NavItem>

      <NavItem ariaLabel="Search">
        <SearchIcon />
      </NavItem>

      {/* ✅ No nesting issue now */}
      <NavItem ariaLabel="Notifications">
        <CommonNotificationFloater direction="up" />
      </NavItem>

      <NavItem ariaLabel="Messages">
        <MessageIcon />
      </NavItem>

      <NavItem ariaLabel="Profile">
        <img
          src={userphoto}
          alt="Profile"
          onClick={() => navigate("/profile")}
          className="
            w-9 h-9 sm:w-10 sm:h-10
            rounded-xl object-cover
            border-2 border-transparent
            transition-all duration-200
            group-hover:border-blue-600
            group-hover:scale-110
          "
        />
      </NavItem>
    </nav>
  );
};

interface NavItemProps {
  children: React.ReactNode;
  active?: boolean;
  ariaLabel: string;
  onClick?: () => void;
}

/**
 * ✅ Smart NavItem
 * - Renders <button> only if onClick exists
 * - Otherwise renders <div> (prevents nested button issue)
 */
const NavItem: React.FC<NavItemProps> = ({
  children,
  active,
  ariaLabel,
  onClick,
}) => {
  const baseClass = clsx(
    `
      group relative
      w-11 h-11 sm:w-10 sm:h-10
      flex items-center justify-center
      rounded-xl
      transition-all duration-200
      hover:bg-gray-100
      hover:-translate-y-0.5
      focus:outline-none
      cursor-pointer
    `,
    active && "bg-blue-100"
  );

  if (onClick) {
    return (
      <button aria-label={ariaLabel} onClick={onClick} className={baseClass}>
        {children}
      </button>
    );
  }

  return (
    <div aria-label={ariaLabel} className={baseClass}>
      {children}
    </div>
  );
};

/* ---------------- Icons ---------------- */

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

const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`${iconBase} text-gray-400 group-hover:text-gray-600`}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const MessageIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`${iconBase} text-gray-400 group-hover:text-gray-600`}
  >
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
  </svg>
);

export default BottomNav;