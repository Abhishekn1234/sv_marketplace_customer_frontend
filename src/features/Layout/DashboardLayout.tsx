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



interface Props {
  onLogout?: () => void;
  children?: React.ReactNode;
}

export default function DashboardLayout({ onLogout, children }: Props) {
  const location = useLocation();

  const hideBottomNav = location.pathname === "/register";
    const pathname = location.pathname;
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 relative">
     
     
 {pathname==="/profile"?(
  <ProfileNavbar/>
 ):(
 <></>
 )}
 {pathname ==="/"?(
<DashboardHeader/>
 ):(
<></>
 )}
 {pathname==="/jobtracking"?(<JobTrackingNavbar/>):(
  <></>
 )}
 {pathname ==="/about"?(
  <AboutHeader/>
 ):(
  <></>
 )}
 {pathname.startsWith("/services/") && <ServiceDetailNavbar />}

     {pathname ==="/privacy"?(
        <PrivacyHeader/>
     ):(
      <></>
     )}
      {hideBottomNav ? (
        <RegisterTabCard />
      ) : (
        <main className="mx-auto max-w-7xl px-4 py-6 pb-24">
          {children || <Outlet />}
        </main>
      )}

      {/* Bottom Navigation */}
      {!hideBottomNav && <BottomNav />}
      
      {pathname.startsWith('/services/') ? (
      <CommonFooter/>
      ):(
        <></>
      )}
        {pathname.startsWith('/servicetierselection/') ? (
          <>
      <CommonNavbar/>
      <CommonFooter/>
     
      </>
      ):(
        <></>
      )}
      {pathname.startsWith('/bookingdetail/')?(
        <>
        <CommonNavbar/>
        <CommonFooter/>
        </>
      ):(
       <>
       </>
      )}
    </div>
  );
}


