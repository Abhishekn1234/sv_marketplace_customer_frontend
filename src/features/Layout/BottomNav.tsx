import React from "react";
import clsx from "clsx";
import { useAuthStore } from "../core/store/auth";
import { useNavigate } from "react-router-dom";
import CommonNotificationFloater from "@/components/common/CommonNotificationFloater";
import {
  HomeIcon,
  AboutIcon,
  BookingIcon,
  UserIcon,
} from "@/components/icons";
import { Image } from "@/components/input";
import Tooltip from "@/components/common/ToolTip";

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
        <HomeIcon className={clsx(iconBase, "text-blue-600")} />
      </NavItem>

      <NavItem ariaLabel="About" tooltip="About" onClick={() => navigate("/about")}>
        <AboutIcon className={clsx(iconBase, "text-gray-400 group-hover:text-gray-600")} />
      </NavItem>

      <NavItem ariaLabel="Notifications" tooltip="Notifications">
        <CommonNotificationFloater direction="up" />
      </NavItem>

      <NavItem ariaLabel="Bookings" tooltip="Bookings" onClick={() => navigate("/bookings")}>
        <BookingIcon className={clsx(iconBase, "text-gray-400 group-hover:text-gray-600")} />
      </NavItem>

      <NavItem ariaLabel="Profile" tooltip="Profile">
        <div
          onClick={() => navigate("/profile")}
          className="w-full h-full flex items-center justify-center"
        >
          {userphoto ? (
            <Image
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
            <UserIcon className={clsx(iconBase, "text-gray-500")} />
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

  const content = onClick ? (
    <button aria-label={ariaLabel} onClick={onClick} className={baseClass}>
      {children}
    </button>
  ) : (
    <div aria-label={ariaLabel} className={baseClass}>
      {children}
    </div>
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

const iconBase = "w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200";

export default BottomNav;