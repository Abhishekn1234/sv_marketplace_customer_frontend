"use client";

import { HeartWithFillToggleFavoriteIcon } from "@/components/icons";
import CommonCard from "@/components/common/CommonCards";
import { useLanguage } from "@/features/context/LanguageContext";

export default function FavoritesEmptyState() {
    const {t}=useLanguage();
  return (
    <CommonCard type="soft" className="rounded-3xl border-[#B9D3EA] py-14 text-center">
      <div className="flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-5">
          <HeartWithFillToggleFavoriteIcon />
        </div>
        <h3
          className="text-xl font-semibold mb-2 text-[#16324F]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {t.favoritespage.emptyState.title}
        </h3>
        <p className="text-sm text-[#5C7A99] max-w-sm">
          {t.favoritespage.emptyState.description}
        </p>
      </div>
    </CommonCard>
  );
}