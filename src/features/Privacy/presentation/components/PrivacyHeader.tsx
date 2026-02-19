import React from "react";
import Logo from "./Logo";
import BackButton from "./BackButton";
import NotificationButton from "./NotificationButton";
import UserProfile from "./UserProfile";

const PrivacyHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-4">

        {/* Left Section */}
        <div className="flex items-center gap-2 sm:gap-5 lg:gap-8 min-w-0">
          <Logo />
          <BackButton />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          <NotificationButton />

          {/* Responsive Divider */}
          <div className="h-6 sm:h-8 w-px bg-gray-200"></div>

          <UserProfile />
        </div>
      </div>
    </header>
  );
};

export default PrivacyHeader;
