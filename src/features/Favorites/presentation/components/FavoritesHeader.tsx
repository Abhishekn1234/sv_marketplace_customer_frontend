"use client";

import Button from "@/components/input/Button";
import { Input } from "@/components/input";
import { HeartIcon, SearchIcon } from "@/components/icons";
import { useLanguage } from "@/features/context/LanguageContext";

interface FavoritesHeaderProps {
  count: number;
  query: string;
  onQueryChange: (value: string) => void;
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function FavoritesHeader({
  count,
  query,
  onQueryChange,
  filters,
  activeFilter,
  onFilterChange,
}: FavoritesHeaderProps) {
    const {t,isRTLOrder}=useLanguage();
  return (
    <div className="flex flex-col gap-6 sm:gap-8 mb-8 sm:mb-10" dir={`${isRTLOrder?"rtl":""}`}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-600 uppercase mb-2">
            <HeartIcon className="w-3.5 h-3.5 fill-blue-600" />
            {t.favoritespage.eyebrow}
          </div>
          <h1
            className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight tracking-tight text-[#16324F]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
           {t.favoritespage.title}
          </h1>
          <p className="mt-1 text-sm sm:text-base text-[#5C7A99] max-w-md">
            {t.favoritespage.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="rounded-2xl bg-white/80 border border-[#B9D3EA] px-4 py-3 shadow-sm">
            <div
              className="text-2xl font-semibold leading-none text-[#16324F]"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {count}
            </div>
            <div className="text-[11px] text-[#5C7A99] mt-1">{t.favoritespage.savedServicesCount}</div>
          </div>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Input
              value={query}
              leftElement={<SearchIcon className="w-5 h-5 text-gray-500" />}
              onChange={(value) => onQueryChange(value)}
              placeholder={t.favoritespage.searchPlaceholder}
              className="w-full rounded-xl bg-white/80 border border-[#B9D3EA] pl-11 pr-4 py-3 text-sm text-[#1B3A5C] placeholder:text-[#7C9BB8] outline-none focus:ring-2 focus:ring-[#2F86D6]/30 focus:border-[#2F86D6]/40 transition shadow-sm"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {filters.map((f) => (
            <Button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition border ${
                activeFilter === f
                  ? "bg-blue-600 text-white border-[#2F86D6]"
                  : "bg-white/70 text-[#5C7A99] border-[#B9D3EA] hover:border-[#2F86D6]/50"
              }`}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}