import { Outlet, useLocation } from "react-router-dom";
import RegisterTabCard from "../Auth/presentation/components/auth/Register/RegisterTab";
import BottomNav from "./BottomNav";
import CommonNavbar from "@/components/common/CommonNavbar";
import Footer from "@/components/common/CommonFooter";

interface Props {
  children?: React.ReactNode;
}

interface NavbarProps {
  showLocation?: boolean;
  showBackButton?: boolean;
  showSearch?: boolean;
  showHomeLinks?:boolean;
}

const navbarPropsMap: Record<string, NavbarProps> = {
  "/": { showLocation: true,showHomeLinks: true },
  "/privacy": { showBackButton: true },
  "/security": { showBackButton: true },
  "/help": { showBackButton: true },
  "/changepassword": { showBackButton: true },
  "/about": { showBackButton: true },
  "/servicerating":{showHomeLinks:true}
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

  const isRegisterPage = pathname === "/register";
 
  const isConfirmationPage = pathname.startsWith("/confirmation/");

  const navbarProps = getNavbarProps(pathname);
  const footer = getFooter(pathname);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 relative">
      {!isRegisterPage && <CommonNavbar {...navbarProps} />}

      {isRegisterPage ? (
        <RegisterTabCard />
      ) : (
        <main className="mx-auto max-w-7xl px-4 py-6 pb-24">
          {children || <Outlet />}
        </main>
      )}

      {!isRegisterPage && !isConfirmationPage && <BottomNav />}

      {footer}
    </div>
  );
}