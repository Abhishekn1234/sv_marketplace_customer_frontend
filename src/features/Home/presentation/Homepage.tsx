import ServiceSearch from "./components/home/SearchInput";
import RecentServices from "./components/home/RecentServices";
import CategoryPills from "./components/home/CategoryPills";
import { useServiceCategory } from "@/features/Bookings/presentation/hooks/useServiceCategory";
import ActiveService from "./components/home/ActiveService";
import PopularService from "./components/home/PopularService";
import SecurePayment from "./components/home/SecurePayment";
import SatisfactionGuarantee from "./components/home/SatisificationGuarantte";
import PromoCards from "./components/home/PromoCards";
import CommonFaq from "@/components/common/CommonFaq";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import { useLanguage } from "@/features/context/LanguageContext";
import { useAuthStore } from "@/features/core/store/auth";
import { useServiceCategoryFilter } from "./hooks/useServiceCategoryFilter";

export default function WebsiteHome() {
  const { data: apiResponse, isLoading, error } = useServiceCategory();
  const { accessToken } = useAuthStore();
  const { isRTLOrder } = useLanguage();
  const {
    activeCategory,
    categories,
    filteredServices,
    handleCategoryChange,
    handleSearchResults,
  } = useServiceCategoryFilter(apiResponse);

  if (isLoading) {
    return (
      <div>
        <CommonSpinner size={20} />
      </div>
    );
  }

  if (error) {
    return <div>Error loading categories</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10" dir={isRTLOrder ? "rtl" : undefined}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="flex flex-col gap-6">
          <ServiceSearch services={apiResponse ?? []} onSearchResults={handleSearchResults} />
          <CategoryPills
            categories={categories}
            activeCategory={activeCategory}
            onChange={handleCategoryChange}
          />

          {accessToken && <ActiveService />}
          <PopularService categories={filteredServices} />
        </div>

        <div className="flex flex-col gap-6">
          {accessToken && <RecentServices />}
          <SecurePayment />
          <SatisfactionGuarantee />
          {accessToken && <PromoCards />}
        </div>
      </div>

      <CommonFaq />
    </div>
  );
}