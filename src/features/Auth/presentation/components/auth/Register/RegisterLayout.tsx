'use client';

import { useLocation } from "react-router-dom";
import RegistrationCard from "./RegisterCard";
import ProgressStepper from "./RegisterTab";
import Footer from "@/components/common/CommonFooter";
import CommonNavbar from "@/components/common/CommonNavbar";

export default function RegisterLayout() {
  const { pathname } = useLocation(); 

  const features = [
    { label: 'Vetted Experts' },
    { label: 'Eco-Friendly' },
    { label: '24/7 Support' },
  ];

  const links = [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Cookie Policy', to: '/cookies' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 font-sans flex flex-col">
      
      {/* Common Navbar for Register Page */}
      <CommonNavbar
        showBackButton={false}
        showSearch={false}
        showLocation={false}
       
        rightButton={{ label: "Sign In", to: "/login", variant: "primary" }} 
        // ✅ custom prop for Sign In button
      />

      <ProgressStepper />

      <main className="flex flex-col items-center justify-center flex-1 px-6 py-10">
        {pathname === "/register" && <RegistrationCard />}
      </main>

      <Footer features={features} links={links} showDivider iconColor="text-warning" />
    </div>
  );
}