import { useEffect, useMemo, useState } from "react";

import type { Category } from "@/features/Bookings/domain/entities/category.types";

export function useServiceCategoryFilter(apiResponse?: Category[]) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filteredServices, setFilteredServices] = useState<Category[]>([]);


  useEffect(() => {
    if (apiResponse) {
      setFilteredServices(apiResponse);
    }
  }, [apiResponse]);

  const categories = useMemo(
    () => ["All", ...(apiResponse?.map((category) => category.name) ?? [])],
    [apiResponse]
  );

  const handleCategoryChange = (categoryName: string) => {
    setActiveCategory(categoryName);

    if (!apiResponse) {
      return;
    }

    if (categoryName === "All") {
      setFilteredServices(apiResponse);
      return;
    }

    const filtered = apiResponse.filter(
      (category) => category.name === categoryName
    );
    setFilteredServices(filtered);
  };

  const handleSearchResults = (services: Category[]) => {
    setFilteredServices(services);
  };

  return {
    activeCategory,
    categories,
    filteredServices,
    handleCategoryChange,
    handleSearchResults,
  };
}
