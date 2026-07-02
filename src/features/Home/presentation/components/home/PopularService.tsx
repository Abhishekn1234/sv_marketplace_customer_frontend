import type { Category } from "@/features/Bookings/domain/entities/category.types";
import { useLanguage } from "@/features/context/LanguageContext";
import CategoryCard from "./CategoryCard";

interface Props {
  categories: Category[];
}

export default function PopularService({ categories }: Props) {
  const { t } = useLanguage();

  if (!categories.length) {
    return <p className="py-10 text-center font-medium text-gray-400">{t.home["No categories found."]}</p>;
  }

  return (
    <div className="mt-8 px-4 sm:px-6 lg:px-2">
      <h2 className="mb-6 text-center text-xl font-bold text-gray-900 sm:text-left sm:text-2xl">
        {t.home["Popular Services"]}
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </div>
    </div>
  );
}