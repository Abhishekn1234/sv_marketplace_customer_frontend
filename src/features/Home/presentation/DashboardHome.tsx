import { useEffect, useState } from "react";
import ServiceSearch from "./components/home/SearchInput";
import RecentServices from "./components/home/RecentServices";
import CategoryPills from "./components/home/CategoryPills";
import { useServiceCategory } from "@/features/Bookings/presentation/hooks/useServiceCategory";
import ActiveService from "./components/home/ActiveService";
import PopularService from "./components/home/PopularService";
import SecurePayment from "./components/home/RecentPayment";
import SatisfactionGuarantee from "./components/home/SatisificationGuarantte";
import PromoCards from "./components/home/PromoCards";
import CommonFaq from "@/components/common/CommonFaq";

export default function WebsiteHome() {
  const { data: apiResponse, isLoading, error } = useServiceCategory();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filteredServices, setFilteredServices] = useState<any[]>([]);


  useEffect(() => {
    if (apiResponse) {
      setFilteredServices(apiResponse);
    }
  }, [apiResponse]);
    console.log(apiResponse)
  const categories = apiResponse?.map((c: { name: string }) => c.name) ?? [];

  const handleCategoryChange = (categoryName: string) => {
    setActiveCategory(categoryName);

    if (!apiResponse) return;

    if (categoryName === "All") {
      setFilteredServices(apiResponse);
    } else {
      const filtered = apiResponse.filter(
        (category: { name: string }) => category.name === categoryName
      );
      setFilteredServices(filtered);
    }
  };

  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div>Error loading categories</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
       
        <div className="flex flex-col gap-6">
          <ServiceSearch
            services={apiResponse ?? []}
            onSearchResults={setFilteredServices}
          />

          
          <CategoryPills
            categories={["All", ...categories]}
            activeCategory={activeCategory}
            onChange={handleCategoryChange}
          />

          <ActiveService />

         
          <PopularService categories={filteredServices} />
        </div>

      
        <div className="flex flex-col gap-6">
          <RecentServices />
          <SecurePayment />
          <SatisfactionGuarantee />
          <PromoCards />
        </div>
      </div>

      <CommonFaq />
    </div>
  );
}