"use client";

import LocationBadge from "./components/LocationBadge";

import LocationHeader from "./components/LocationHeader";
import LocationInputs from "./components/LocationInputs";




export default function LocationPage() {
  return (
    <div className="min-h-screen  text-gray-900 flex flex-col">
     
      
    
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-3xl w-full flex flex-col items-center gap-10">
          <LocationBadge />
          <LocationHeader />
          <LocationInputs />
         
        </div>
      </main>


    </div>
  );
}


