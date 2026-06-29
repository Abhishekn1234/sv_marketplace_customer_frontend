import { useState, useRef, useEffect } from "react";

import { useLanguage } from "@/features/context/LanguageContext";
import type { FilterKey, SortKey } from "../../domain/entities/filterkeys";
import Button from "@/components/input/Button";
import { ChevronDownIcon } from "@/components/icons";

interface Props {
  activeFilter: FilterKey;
  setActiveFilter: (value: FilterKey) => void;
  sortBy: SortKey;
  setSortBy: (value: SortKey) => void;
}

export default function ServiceDetailFilter({
  activeFilter,
  setActiveFilter,
  sortBy,
  setSortBy,
}: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // ✅ stable keys
 const filters: FilterKey[] = [
  "All Services",
  "Popular",
  "Same Day",
  "Eco Friendly"
];

const sortOptions: SortKey[] = [
  "Recommended",
  "Price High To Low",
  "Price Low To High"
];
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => {
          const isActive = filter === activeFilter;

          return (
            <Button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-900 border-2 border-gray-200 hover:border-blue-600"
                }`}
            >
              {t.servicedetailpage.filters[filter]}
            </Button>
          );
        })}
      </div>

      {/* Sort */}
      <div className="relative" ref={dropdownRef}>
      <Button
  onClick={() => setDropdownOpen(!dropdownOpen)}
  className="flex items-center gap-2 text-gray-500 font-semibold text-sm hover:text-blue-600"
 rightIcon={
  <>
    <ChevronDownIcon
    className={`w-4 h-4 transition-transform ${
      dropdownOpen ? "rotate-180" : ""
    }`}
  />
  </>
 }
>
  <span className="whitespace-nowrap">
    {t.servicedetailpage.filters["Sort By"]}:{" "}
    {t.servicedetailpage.filters[sortBy as SortKey]}
  </span>


</Button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
            {sortOptions.map((option) => (
              <Button
                key={option}
                onClick={() => {
                  setSortBy(option);
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  sortBy === option
                    ? "font-semibold text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {t.servicedetailpage.filters[option]}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}