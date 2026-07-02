import { useNavigate } from "react-router-dom";
import { Image } from "@/components/input";
import { SquareIcon, StarIcon } from "@/components/icons";
import type { Category } from "@/features/Bookings/domain/entities/category.types";
import { useCategoryCardMetrics } from "../../hooks/useCategoryCardMetrics";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const navigate = useNavigate();
  const { averagePrice, averageRating, serviceCount } = useCategoryCardMetrics(category);

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={() => navigate(`/services/${category._id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          navigate(`/services/${category._id}`);
        }
      }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 py-6 text-center transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-transparent hover:shadow-2xl active:scale-95"
    >
      <span className="absolute inset-x-0 top-0 h-0.75 origin-left scale-x-0 bg-blue-600 transition-transform duration-300 group-hover:scale-x-100" />

      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-blue-50">
        {category.iconUrl ? (
          <Image src={category.iconUrl} alt={category.name} className="h-8 w-8 object-contain" />
        ) : (
          <SquareIcon />
        )}
      </div>

      <h3 className="mb-2 truncate text-base font-semibold text-gray-900 sm:text-lg">
        {category.name}
      </h3>

      {averagePrice && (
        <p className="text-sm font-bold text-blue-600 tabular-nums sm:text-base">
          {averagePrice}
        </p>
      )}

      <div className="mt-2 flex items-center justify-center gap-1 text-sm text-gray-500">
        <StarIcon />
        {averageRating}
      </div>

      <p className="mt-1 text-xs text-gray-400">{serviceCount} Services</p>
    </div>
  );
}
