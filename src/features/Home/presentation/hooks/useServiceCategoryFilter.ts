// useServiceCategoryFilter.ts
import { useMemo, useState } from "react";
import type { Category } from "@/features/Bookings/domain/entities/category.types";

export function useServiceCategoryFilter(apiResponse: Category[] = []) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => apiResponse, [apiResponse]);

  const filteredServices = useMemo(() => {
    if (activeCategory === "All") {
      return apiResponse;
    }

    return apiResponse.filter(
      (category) => category._id === activeCategory
    );
  }, [apiResponse, activeCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return {
    activeCategory,
    categories,
    filteredServices,
    handleCategoryChange,
    handleSearchResults: () => {},
  };
}