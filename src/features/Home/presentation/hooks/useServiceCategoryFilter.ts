import { useEffect, useMemo, useState } from "react";

type ServiceCategoryItem = {
  name: string;
  [key: string]: unknown;
};

export function useServiceCategoryFilter(apiResponse?: ServiceCategoryItem[]) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filteredServices, setFilteredServices] = useState<ServiceCategoryItem[]>([]);

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

  const handleSearchResults = (services: ServiceCategoryItem[]) => {
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
