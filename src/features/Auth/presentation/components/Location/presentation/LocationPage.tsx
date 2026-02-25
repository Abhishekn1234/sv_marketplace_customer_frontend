"use client";

import RegisterHeader from "@/features/Layout/RegisterHeader";
import LocationBadge from "./components/LocationBadge";

import LocationHeader from "./components/LocationHeader";
import LocationInputs from "./components/LocationInputs";
import ProgressStepper from "../../auth/Register/RegisterTab";

import Footer from "@/components/common/CommonFooter";
import CommonNavbar from "@/components/common/CommonNavbar";

export default function LocationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 flex flex-col">
     
      <CommonNavbar rightButton={{ label: "Sign In", to: "/login", variant: "primary" }} />
      <ProgressStepper/>

    
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-3xl w-full flex flex-col items-center gap-10">
          <LocationBadge />
          <LocationHeader />
          <LocationInputs />
         
        </div>
      </main>

      
      <Footer/>
    </div>
  );
}


