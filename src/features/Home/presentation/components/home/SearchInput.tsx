
import { Input } from "@/components/input";
import type { Category } from "@/features/Bookings/domain/entities/category.types";
import { useLanguage } from "@/features/context/LanguageContext";

import React, { useState, useEffect } from "react";



interface Props {
  services:Category[]; 
  onSearchResults: (results: Category[]) => void; 
}

const ServiceSearch: React.FC<Props> = ({ services, onSearchResults }) => {
  const [query, setQuery] = useState("");
  const {t}=useLanguage();
  useEffect(() => {
    if (!query) {
      onSearchResults(services); 
      return;
    }

    const filtered = services.filter((service) =>
      service.name.toLowerCase().includes(query.toLowerCase())
    );

    onSearchResults(filtered);
  }, [query, services, onSearchResults]);

  return (
    <div className="flex flex-col gap-7 max-w-4xl">
      {/* Title */}
      <h1 className="text-[36px] font-bold leading-[1.2] tracking-[-0.02em] text-gray-900">
       {t.home["What service do you need?"]}
      </h1>

      {/* Search Bar */}
      <div className="relative w-full">
        {/* Search Icon */}
       

        {/* Input */}
        <Input
          type="text"
          placeholder={t.home["Search for cleaning, repair"]}
          aria-label="Search services"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
         leftElement={
              <svg
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            }
          className="
            w-full h-[56px]
            rounded-2xl
            border border-gray-200
            bg-white
            pl-[52px] pr-[56px]
            text-[16px] text-gray-900
            outline-none
            transition-all duration-200
            placeholder:text-gray-400
            hover:border-gray-400
            focus:border-blue-600
            focus:ring-4 focus:ring-blue-600/10
          "
        />

        {/* Mic Icon */}
      
      </div>
    </div>
  );
};

export default ServiceSearch;

