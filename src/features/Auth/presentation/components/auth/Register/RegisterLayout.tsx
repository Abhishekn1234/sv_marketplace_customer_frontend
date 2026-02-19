'use client';

import { useLocation } from "react-router-dom";
import RegisterFooter from "./RegisterFooter";
import RegistrationCard from "./RegisterCard";
import ProgressStepper from "./RegisterTab";
import RegisterHeader from "@/features/Layout/RegisterHeader";
// import LocationPage from "../../Location/presentation/LocationPage";

export default function RegisterLayout() {
  const pathname = useLocation(); 

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 font-sans flex flex-col">
      <RegisterHeader />
      <ProgressStepper />

      <main className="flex flex-col items-center justify-center flex-1 px-6 py-10">
        {pathname.pathname === "/register" && <RegistrationCard />}
         
      </main>

      <RegisterFooter />
    </div>
  );
}


