import { Outlet, useLocation } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import RegisterTabCard from "../Auth/presentation/components/auth/Register/RegisterTab";
import BottomNav from "./BottomNav"; 

import ProfileNavbar from "../Profile/presentation/components/ProfileNavbar";
import PrivacyHeader from "../Privacy/presentation/components/PrivacyHeader";
import AboutHeader from "../AboutUs/presentation/components/AboutHeader";
import ServiceDetailNavbar from "../ServiceDetails/presentation/components/ServiceDetailNavbar";


import CommonFooter from "@/components/common/CommonFooter";
import CommonNavbar from "@/components/common/CommonNavbar";

import JobTrackingNavbar from "../JobTracking/presentation/components/JobTrackingNavbar";
import ConfirmationNavbar from "../Confirmation/presentation/components/ConfirmationNavbar";
import ConfirmationFooter from "../Confirmation/presentation/components/ConfirmationFooter";
import BookingHistoryNavbar from "../Bookings/presentation/components/BookingHistoryNavbar";



interface Props {
 
  children?: React.ReactNode;
}

export default function DashboardLayout({  children }: Props) {
  const location = useLocation();
  const pathname = location.pathname;

  const isRegisterPage = pathname === "/register";
  const isConfirmationPage = pathname.startsWith("/confirmation/");

  // 🔹 Decide which header to show
  const renderHeader = () => {
    if (pathname === "/profile") return <ProfileNavbar />;
    if (pathname === "/") return <DashboardHeader />;
    if (pathname.startsWith( "/jobtracking/")) return <JobTrackingNavbar />;
    if (pathname === "/about") return <AboutHeader />;
    if (pathname === "/privacy") return <PrivacyHeader />;
    if (pathname.startsWith("/services/")) return <ServiceDetailNavbar />;
    if (pathname.startsWith("/servicetierselection/")) return <CommonNavbar />;
    if (pathname.startsWith("/bookingdetail/")) return <CommonNavbar />;
    if(pathname === "/bookings") return <BookingHistoryNavbar />;
    if(pathname==="/changepassword") return <CommonNavbar/>;
    if (isConfirmationPage) return <ConfirmationNavbar />;
   if(pathname==="/security") return <PrivacyHeader/>;
   if(pathname==="/help") return <PrivacyHeader/>;
    return null;
  };

  // 🔹 Decide which footer to show
  const renderFooter = () => {
    if (pathname.startsWith("/services/")) return <CommonFooter />;
    if (pathname.startsWith("/servicetierselection/")) return <CommonFooter />;
    if (pathname.startsWith("/bookingdetail/")) return <CommonFooter />;
    if (isConfirmationPage) return <ConfirmationFooter />;
    if(pathname==="/changepassword") return <CommonFooter/>;

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 relative">

      {/* ✅ HEADER (Always at top if exists) */}
      {renderHeader()}

      {/* ✅ MAIN CONTENT */}
      {isRegisterPage ? (
        <RegisterTabCard />
      ) : (
       <main className="mx-auto max-w-7xl px-4 py-6 pb-24"> {children || <Outlet />} </main>
      )}

      {/* ✅ Bottom Navigation (Hidden for Register & Confirmation) */}
      {!isRegisterPage && !isConfirmationPage && <BottomNav />}

      {/* ✅ FOOTER (Always at bottom if exists) */}
      {renderFooter()}
      
    </div>
  );
}



