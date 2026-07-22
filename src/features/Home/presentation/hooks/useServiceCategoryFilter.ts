import { useMemo, useState } from "react";
import type { Category } from "@/features/Bookings/domain/entities/category.types";

export function useServiceCategoryFilter(apiResponse: Category[] = []) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...apiResponse.map((c) => c.name)],
    [apiResponse]
  );

  const filteredServices = useMemo(() => {
    if (activeCategory === "All") {
      return apiResponse;
    }

    return apiResponse.filter(
      (category) => category.name === activeCategory
    );
  }, [apiResponse, activeCategory]);

  const handleCategoryChange = (categoryName: string) => {
    setActiveCategory(categoryName);
  };

  return {
    activeCategory,
    categories,
    filteredServices,
    handleCategoryChange,
    handleSearchResults: () => {},
  };
}