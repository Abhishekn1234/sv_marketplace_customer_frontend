import React from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../core/store/auth";

import CommonNotificationFloater from "@/components/common/CommonNotificationFloater";
import Tooltip from "@/components/common/ToolTip";
import { Image } from "@/components/input";

import {
  HomeIcon,
  AboutIcon,
  BookingIcon,
  LoginIcon,
  UserIcon,
} from "@/components/icons";

import { iconBase } from "@/components/common/iconbase";
import Button from "@/components/input/Button";

const BottomNav: React.FC = () => {
  const { user, accessToken } = useAuthStore();
  const navigate = useNavigate();

  const userPhoto = user?.profilePictureUrl;

  return (
    <nav
      aria-label="Main navigation"
      className="
        fixed bottom-6 left-1/2 -translate-x-1/2
        w-[90%] sm:w-auto
        flex items-center justify-around sm:justify-center
        gap-2 sm:gap-3
        bg-white/95 backdrop-blur-md
        px-3 py-2 sm:px-4
        rounded-3xl
        shadow-xl
        border border-white/50
        z-[100]
      "
    >
      {/* Home */}
      <NavItem ariaLabel="Home" tooltip="Home" onClick={() => navigate("/")}>
        <HomeIcon className={clsx(iconBase, "text-blue-600")} />
      </NavItem>

      {/* About */}
      <NavItem ariaLabel="About" tooltip="About" onClick={() => navigate("/about")}>
        <AboutIcon className={clsx(iconBase, "text-gray-400 group-hover:text-gray-600")} />
      </NavItem>

      {accessToken ? (
        <>
          {/* Notifications */}
          <NavItem ariaLabel="Notifications" tooltip="Notifications">
            <CommonNotificationFloater direction="up" />
          </NavItem>

          {/* Bookings */}
          <NavItem ariaLabel="Bookings" tooltip="Bookings" onClick={() => navigate("/bookings")}>
            <BookingIcon className={clsx(iconBase, "text-gray-400 group-hover:text-gray-600")} />
          </NavItem>

          {/* Profile */}
                <NavItem ariaLabel="Profile" tooltip="Profile" onClick={() => navigate("/profile")}>
          {userPhoto ? (
            <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0">
              <Image
                src={userPhoto}
                alt="Profile"
                className="w-full h-full rounded-full object-cover block"
              />
            </div>
          ) : (
            <UserIcon className={clsx(iconBase, "text-gray-500")} />
          )}
        </NavItem>
        </>
      ) : (
        <>
          {/* Bookings */}
          <NavItem ariaLabel="Bookings" tooltip="Bookings" onClick={() => navigate("/bookings")}>
            <BookingIcon className={clsx(iconBase, "text-gray-400 group-hover:text-gray-600")} />
          </NavItem>

          {/* Login */}
          <NavItem ariaLabel="Login" tooltip="Login" onClick={() => navigate("/login")}>
            <LoginIcon className="w-5 h-5 text-blue-600" />
          </NavItem>
        </>
      )}
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
  const baseClass =
    "w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl cursor-pointer hover:scale-105 transition";

  const content = (
    <Button
      aria-label={ariaLabel}
      onClick={onClick}
      className={baseClass}
      type="button"
    >
      {children}
    </Button>
  );

  return (
    <div className="flex items-center justify-center">
      {tooltip ? (
        <Tooltip text={tooltip} position="top">
          {content}
        </Tooltip>
      ) : (
        content
      )}
    </div>
  );
};

export default BottomNav;