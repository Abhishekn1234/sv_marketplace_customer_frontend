"use client";

import { Service } from "@/features/Bookings/domain/entities/service.types";
import Button from "@/components/input/Button";
import { Image } from "@/components/input";
import {
  ArrowRight,
  BadgeCheckIcon,
  HeartIcon,
  PauseCircleIcon,
  StarIcon,
} from "@/components/icons";

import CommonCard from "@/components/common/CommonCards";
import { getStartingPrice } from "../utils/getstartingprice";
import { getCategoryNames } from "../utils/getcategoryname";
import { useLanguage } from "@/features/context/LanguageContext";

interface ServiceFavoriteCardProps {
  service: Service;
  onRemoveFavorite: (id: string) => void;
  onBookNow: (service: Service) => void;
}

export default function ServiceFavoriteCard({
  service,
  onRemoveFavorite,
  onBookNow,
}: ServiceFavoriteCardProps) {
  const price = getStartingPrice(service);
  const categories = getCategoryNames(service);
 const{t}=useLanguage();
  return (
    <CommonCard
      type="white"
      className="h-full flex flex-col rounded-3xl border-[#B9D3EA] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden p-0 gap-0"
      contentClassName="p-0 flex-1 flex flex-col min-h-0"
      footer={
        <div className="flex items-center justify-between w-full">
          <div>
            <div
              className="text-lg font-semibold leading-none text-green-950"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {price !== null ? `${service.currency} ${price}` : t.favoritespage.card.customQuote}
            </div>
            <div className="text-[11px] text-gray-400 mt-1">{t.favoritespage.card.startingPrice}</div>
          </div>
          <Button
            rightIcon={<ArrowRight />}
            onClick={() => onBookNow(service)}
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 text-white text-sm font-medium px-4 py-2.5 hover:bg-[#16324F] transition"
          >
          {t.favoritespage.card.bookNow}
          </Button>
        </div>
      }
    >
      {/* Thumbnail */}
      <div className="relative h-36 sm:h-40 w-full bg-[#DCE9F7] overflow-hidden rounded-t-3xl">
        {service.thumbnailUrl ? (
          <Image
            src={service.thumbnailUrl}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#7C9BB8] text-sm">
           {t.favoritespage.card.noPreview}
          </div>
        )}
        <Button
          onClick={() => onRemoveFavorite(service._id)}
          aria-label="Remove from favorites"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[#2F86D6] hover:text-[#E24C6D] transition shadow-sm"
        >
          <HeartIcon className="w-4 h-4 fill-current" />
        </Button>
        {!service.isActive && (
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-[#5C7A99]">
            <PauseCircleIcon className="w-3 h-3" />
           {t.favoritespage.card.paused}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {categories.map((c) => (
            <span
              key={c}
              className="text-[11px] font-semibold tracking-wide uppercase text-blue-600 bg-[#2F86D6]/8 rounded-full px-2.5 py-1"
            >
              {c}
            </span>
          ))}
        </div>

        <h3
          className="text-base sm:text-lg font-semibold leading-snug mb-1.5 text-[#16324F]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {service.name}
        </h3>
        <p className="text-sm text-gray-500 mb-5 line-clamp-2">{service.description}</p>

        <div className="flex items-center gap-1">
          <StarIcon className="w-4 h-4 fill-blue-600 text-blue-600" />
          <span className="font-medium text-sm text-blue-600">
            {service.avgRating.toFixed(1)}
          </span>
          <span className="text-gray-400 text-xs">({service.totalRatings}{t.favoritespage.card.ratings})</span>
          <BadgeCheckIcon className="w-4 h-4 text-blue-600 ml-1" />
        </div>
      </div>
    </CommonCard>
  );
}