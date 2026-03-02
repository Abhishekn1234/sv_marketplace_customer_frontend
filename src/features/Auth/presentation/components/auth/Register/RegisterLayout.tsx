'use client';

import RegistrationCard from "./RegisterCard";
import ProgressStepper from "./RegisterTab";




export default function RegisterLayout() {



  return (
    <div className="min-h-screen  text-gray-900 font-sans flex flex-col">
      
  

    

      <main className="flex flex-col items-center justify-center flex-1 px-6 py-10">
         <RegistrationCard />
      </main>

     
    </div>
  );
}