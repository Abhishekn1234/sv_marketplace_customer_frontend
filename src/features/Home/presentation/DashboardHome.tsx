import { useState } from "react";
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
  const [filteredServices, setFilteredServices] = useState(apiResponse ?? []);

  const categories = apiResponse?.map((c: { name: string }) => c.name) ?? [];

  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div>Error loading categories</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">
          <ServiceSearch
            services={apiResponse ?? []}
            onSearchResults={setFilteredServices}
          />

          <CategoryPills
            categories={categories}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />

          <ActiveService  />
          <PopularService services={filteredServices} />
        </div>

        {/* RIGHT COLUMN */}
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



