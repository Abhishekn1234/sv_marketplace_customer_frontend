
import { SearchIcon, XIcon } from "@/components/icons";
import { Input } from "@/components/input";
import Button from "@/components/input/Button";
import type { Category } from "@/features/Bookings/domain/entities/category.types";
import { useLanguage } from "@/features/context/LanguageContext";

import React, { useState, useEffect } from "react";



interface Props {
  services:Category[]; 
  onSearchResults: (results: Category[]) => void; 
}

const ServiceSearch: React.FC<Props> = ({ services, onSearchResults }) => {
  const [query, setQuery] = useState("");
  const {t,localize}=useLanguage();
 useEffect(() => {
  if (!query.trim()) {
    onSearchResults(services);
    return;
  }

  const search = query.toLowerCase().trim();

  const filtered = services.filter((service) =>
    localize(service.name)
      .toLowerCase()
      .includes(search)
  );

  onSearchResults(filtered);
}, [query, services, onSearchResults, localize]);
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
          onChange={(value) => setQuery(value)}
           leftElement={
             <SearchIcon className="w-5 h-5" />
            }
                        rightElement={
              query ? (
                <Button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <XIcon className="w-5 h-5" />
                </Button>
              ) : null
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

