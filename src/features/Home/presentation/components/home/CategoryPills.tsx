import Button from "@/components/input/Button";
import type { Category } from "@/features/Bookings/domain/entities/category.types";
import { useLanguage } from "@/features/context/LanguageContext";

interface Props {
  categories: Category[];
  activeCategory: string | null;
  onChange: (categoryId: string) => void;
}

export default function CategoryPills({
  categories,
  activeCategory,
  onChange,
}: Props) {
  const { localize, t } = useLanguage();

  return (
    <div className="flex flex-wrap gap-3">

      {/* All Button */}
     <Button
  key="all"
  onClick={() => onChange("All")}
  className={`
    rounded-full
    px-6
    py-2.5
    text-sm
    font-semibold
    transition-all
    duration-300
    border
    active:scale-95
    shadow-sm
    hover:-translate-y-0.5
    hover:shadow-md
    ${
      activeCategory === "All"
        ? "border-blue-600 bg-blue-600 text-white shadow-blue-200 shadow-lg"
        : "border-gray-200 bg-white text-gray-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
    }
  `}
>
  {t.favoritespage.filters.all ?? "All"}
</Button>

      {/* Category Buttons */}
      {categories.map((category) => {
        const isActive = activeCategory === category._id;

        const localizedName =
          Object.values(category.services?.[0]?.category ?? {})[0]?.name ??
          category.name;

        return (
        <Button
            key={category._id}
            onClick={() => onChange(category._id)}
            className={`
              rounded-full
              px-6
              py-2.5
              text-sm
              font-semibold
              transition-all
              duration-300
              border
              active:scale-95
              shadow-sm
              hover:-translate-y-0.5
              hover:shadow-md
              ${
                isActive
                  ? "border-blue-600 bg-blue-600 text-white shadow-blue-200 shadow-lg"
                  : "border-gray-200 bg-white text-gray-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
              }
            `}
          >
            {localize(localizedName)}
          </Button>
        );
      })}
    </div>
  );
}