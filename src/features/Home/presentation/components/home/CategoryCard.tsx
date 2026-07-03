import { useNavigate } from "react-router-dom";
import { Image } from "@/components/input";
import { SquareIcon, StarIcon } from "@/components/icons";
import type { Category } from "@/features/Bookings/domain/entities/category.types";
import { useCategoryCardMetrics } from "../../hooks/useCategoryCardMetrics";
import { useLanguage } from "@/features/context/LanguageContext";
import CommonCard from "@/components/common/CommonCards";
import { KeyboardEvent } from "react";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const navigate = useNavigate();
  const { averagePrice, averageRating, serviceCount } =
    useCategoryCardMetrics(category);
  const { t } = useLanguage();

 return (
 <CommonCard
  tabIndex={0}
  role="button"
  onClick={() => navigate(`/services/${category._id}`)}
  onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate(`/services/${category._id}`);
    }
  }}
  className="group relative h-60 overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg active:scale-95"
  contentClassName="flex h-full flex-col items-center justify-center p-4 text-center"
>
  {/* Top Border */}
  <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-blue-600 transition-transform duration-300 group-hover:scale-x-100" />

  {/* Icon */}
  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-50">
    {category.iconUrl ? (
      <Image
        src={category.iconUrl}
        alt={category.name}
        className="h-7 w-7 object-contain"
      />
    ) : (
      <SquareIcon />
    )}
  </div>

  {/* Title */}
  <h3 className="line-clamp-2 h-12 text-base font-semibold text-gray-900">
    {category.name}
  </h3>

  {/* Price */}
  {averagePrice && (
    <p className="mt-2 text-lg font-bold text-blue-600">
      {averagePrice}
    </p>
  )}

  {/* Rating */}
  <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
    <StarIcon />
    <span>{averageRating}</span>
  </div>

  {/* Service Count */}
  <p className="mt-1 text-xs text-gray-400">
    {serviceCount} {t.common.service}
  </p>
</CommonCard>
);
}