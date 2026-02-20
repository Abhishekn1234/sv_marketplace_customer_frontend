import type { Category } from "@/features/Bookings/domain/entities/category.types";
import React, { useState, useEffect } from "react";



interface Props {
  services:Category[]; // All services fetched from API
  onSearchResults: (results: Category[]) => void; // Callback for filtered services
}

const ServiceSearch: React.FC<Props> = ({ services, onSearchResults }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!query) {
      onSearchResults(services); // No query → show all
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
        What service do you
        <br />
        need?
      </h1>

      {/* Search Bar */}
      <div className="relative w-full">
        {/* Search Icon */}
        <svg
          className="absolute left-[18px] top-1/2 -translate-y-1/2 w-[22px] h-[22px] text-gray-400 pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>

        {/* Input */}
        <input
          type="text"
          placeholder="Search for cleaning, repair..."
          aria-label="Search services"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
        <svg
          className="
            absolute right-[18px] top-1/2 -translate-y-1/2
            w-[22px] h-[22px]
            text-gray-500
            cursor-pointer
            rounded-full
            p-1 -m-1
            transition-all duration-200
            hover:bg-gray-100 hover:text-blue-600
          "
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-label="Voice search"
        >
          <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
          <path d="M19 10v2a7 7 0 01-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </div>
    </div>
  );
};

export default ServiceSearch;

