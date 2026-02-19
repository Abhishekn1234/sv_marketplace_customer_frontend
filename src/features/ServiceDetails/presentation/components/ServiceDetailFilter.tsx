import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const filters = ["All Services", "Popular", "Same Day", "Eco-friendly"];
const sortOptions = ["Recommended", "Price Low to High", "Price High to Low"];

interface Props {
  activeFilter: string;
  setActiveFilter: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

export default function ServiceDetailFilter({
  activeFilter,
  setActiveFilter,
  sortBy,
  setSortBy,
}: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      {/* Filter Pills */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => {
          const isActive = filter === activeFilter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-900 border-2 border-gray-200 hover:border-blue-600"
                }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Sort Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1.5 text-gray-500 font-semibold text-sm hover:text-blue-600"
        >
          Sort by: {sortBy}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
            {sortOptions.map((option) => (
              <button
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
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
