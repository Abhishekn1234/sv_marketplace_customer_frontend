import { Outlet, useLocation } from "react-router-dom";

import BottomNav from "./BottomNav";
import CommonNavbar from "@/components/common/CommonNavbar";
import Footer from "@/components/common/CommonFooter";
import ProgressStepper from "../Auth/presentation/components/auth/Register/RegisterTab";
import VerificationStepper from "../Auth/presentation/components/Verification/presentation/components/VerificationStepper";
// import { useVerificationStore } from "../core/store/usestep";

interface Props {
  children?: React.ReactNode;
}

interface NavbarProps {
  showLocation?: boolean;
  showBackButton?: boolean;
  showSearch?: boolean;
  showHomeLinks?: boolean;
}

const navbarPropsMap: Record<string, NavbarProps> = {
  "/": { showLocation: true, showHomeLinks: true },
  "/privacy": { showBackButton: true },
  "/security": { showBackButton: true },
  "/help": { showBackButton: true },
  "/changepassword": { showBackButton: true },
  "/about": { showBackButton: true },
  "/servicerating": {},
  "/bookings": { showLocation: true },
};

const getNavbarProps = (pathname: string): NavbarProps => {
  if (navbarPropsMap[pathname]) return navbarPropsMap[pathname];

  if (pathname.startsWith("/services/")) return { showSearch: true };

  if (
    pathname.startsWith("/bookingdetail/") ||
    pathname.startsWith("/jobtracking/") ||
    pathname.startsWith("/servicetierselection/")
  )
    return { showLocation: true };

  if (pathname.startsWith("/confirmation/")) return { showBackButton: true };

  return {};
};

const getFooter = (pathname: string) => {
  return <Footer backdropBlur={pathname.startsWith("/confirmation/")} />;
};

export default function DashboardLayout({ children }: Props) {
  const { pathname } = useLocation();
  // const { step } = useVerificationStore(); 

  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const isForgotPage = pathname === "/forgot-password";
  const isVerificationPage = pathname === "/verification";
  const isLocationPage = pathname === "/location";
  const isLanguagePage = pathname === "/language";

  const isAuthPage =
    isLoginPage ||
    isRegisterPage ||
    isForgotPage ||
    isVerificationPage ||
    isLanguagePage ||
    isLocationPage;

  const isConfirmationPage = pathname.startsWith("/confirmation/");

  const navbarProps = getNavbarProps(pathname);

  const rightButton =
    isLoginPage
      ? { label: "Sign Up", to: "/register" }
      : isForgotPage
      ? { label: "Sign In", to: "/login" }
      : isVerificationPage
      ? { label: "Sign In", to: "/login" }
      : isRegisterPage
      ? { label: "Sign In", to: "/login" }
      : isLanguagePage
      ? { label: "Sign In", to: "/register" }
      : isLocationPage
      ? { label: "Sign In", to: "/login" }
      : undefined;

  const footer = getFooter(pathname);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 relative flex flex-col">
      <CommonNavbar
        {...navbarProps}
        showUserControls={!isAuthPage}
        showHomeLinks={!isAuthPage && navbarProps.showHomeLinks}
        rightButton={rightButton}
      />

      {/* Only show stepper in specific pages */}
      {(isRegisterPage || isLanguagePage || isLocationPage) && <ProgressStepper />}

      {isVerificationPage && (
        <VerificationStepper  />
      )}

      <main className="flex-1 mx-auto max-w-7xl px-4 py-6 pb-24 w-full">
        {children || <Outlet />}
      </main>

      {!isAuthPage && !isConfirmationPage && <BottomNav />}

      {footer}
    </div>
  );
}