import { Outlet, useLocation } from "react-router-dom";

import BottomNav from "./BottomNav";
import CommonNavbar from "@/components/common/CommonNavbar";
import Footer from "@/components/common/CommonFooter";
import ProgressStepper from "../Auth/presentation/components/auth/Register/RegisterTab";
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
  "/servicerating": { },
  "/bookings":{showLocation:true},
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

  if (pathname.startsWith("/confirmation/"))
    return { showBackButton: true };

  return {};
};

const getFooter = (pathname: string) => {
  return <Footer backdropBlur={pathname.startsWith("/confirmation/")} />;
};

export default function DashboardLayout({ children }: Props) {
  const { pathname } = useLocation();

  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const isForgotPage = pathname === "/forgot-password";
  const isVerificationPage = pathname === "/verification";
  const islocationPage=pathname==="/location";
  const islangugepage=pathname==="/language";

  const isAuthPage =
    isLoginPage || isRegisterPage || isForgotPage || isVerificationPage || islangugepage || islocationPage;

  const isConfirmationPage = pathname.startsWith("/confirmation/");

  const navbarProps = getNavbarProps(pathname);

  const rightButton =
    isLoginPage
      ? { label: "Sign Up", to: "/register" }:isForgotPage?{label:"Sign In",to:"/login"}
      : isRegisterPage
      ? { label: "Sign In", to: "/login" }
      : islangugepage?{label:"Sign In", to:"/register"} :islocationPage?{label:"Sign In", to:"/login"}:undefined;

  const footer = getFooter(pathname);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 relative flex flex-col">
      <CommonNavbar
  {...navbarProps}
  showUserControls={!isAuthPage}
  showHomeLinks={!isAuthPage && navbarProps.showHomeLinks}
  rightButton={rightButton}
/>
{(isRegisterPage || islangugepage || islocationPage) && (
  <ProgressStepper />
)}
<main className="flex-1 mx-auto max-w-7xl px-4 py-6 pb-24 w-full">
  {children || <Outlet />}
</main>
      {!isAuthPage && !isConfirmationPage && <BottomNav />}

      {footer}
    </div>
  );
}