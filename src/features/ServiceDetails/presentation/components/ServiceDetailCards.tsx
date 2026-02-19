import { useServiceCategory } from "@/features/Bookings/presentation/hooks/useServiceCategory";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import { useSearchStore } from "@/features/core/store/auth";
import { useNavigate, useParams } from "react-router-dom";
import CustomQuote from "./GetCustomQuote";

interface Props {
  activeFilter: string;
  sortBy: string;
}

export default function ServiceDetailCards({
  activeFilter,
  sortBy,
}: Props) {
  const { id } = useParams();
  const { searchTerm } = useSearchStore();
  const navigate = useNavigate();

  const { services, loading: loadingServices, error } = useServices();
  const { isPending: loadingCategories } = useServiceCategory();

  if (loadingServices || loadingCategories) {
    return <p className="text-gray-500">Loading services...</p>;
  }

  if (error) {
    return <p className="text-red-500">Failed to load services.</p>;
  }

  // =========================
  // CATEGORY FILTER
  // =========================
  let filteredServices = services?.filter(
    (service) => service.category?._id === id
  );

  // =========================
  // SEARCH FILTER
  // =========================
  if (searchTerm?.trim()) {
    filteredServices = filteredServices?.filter((service) =>
      service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // =========================
  // CUSTOM FILTERS
  // =========================
  if (activeFilter === "Popular") {
    filteredServices = filteredServices?.filter(
      (service) => service.avgRating >= 4
    );
  }

  if (activeFilter === "Same Day") {
    filteredServices = filteredServices?.filter((service) =>
      service.pricingTiers?.some((tier) => tier.HOURLY)
    );
  }

  if (activeFilter === "Eco-friendly") {
    filteredServices = filteredServices?.filter((service) =>
      service.description?.toLowerCase().includes("eco")
    );
  }

  // =========================
  // PRICE HELPER
  // =========================
  const getPrice = (service: any) => {
    const tier = service.pricingTiers?.[0];
    if (!tier) return 0;
    if (tier.HOURLY) return tier.HOURLY.ratePerHour;
    if (tier.PER_DAY) return tier.PER_DAY.ratePerDay;
    return 0;
  };

  // =========================
  // SORTING
  // =========================
  if (sortBy === "Price Low to High") {
    filteredServices = [...(filteredServices || [])].sort(
      (a, b) => getPrice(a) - getPrice(b)
    );
  }

  if (sortBy === "Price High to Low") {
    filteredServices = [...(filteredServices || [])].sort(
      (a, b) => getPrice(b) - getPrice(a)
    );
  }

  if (sortBy === "Recommended") {
    filteredServices = [...(filteredServices || [])].sort(
      (a, b) => b.avgRating - a.avgRating
    );
  }

  // =========================
  // EMPTY STATE
  // =========================
  if (!filteredServices?.length) {
    return (
      <p className="text-gray-500">
        {searchTerm
          ? `No results found for "${searchTerm}"`
          : "No services found."}
      </p>
    );
  }

  // =========================
  // RENDER
  // =========================
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 mb-8">
      {filteredServices.map((service) => {
        const isPremium = service.pricingTiers?.some(
          (tier) =>
            tier.commissionType === "PERCENTAGE" &&
            tier.commissionValue >= 20
        );

        const isInstant = service.pricingTiers?.some(
          (tier) => tier.HOURLY || tier.PER_DAY
        );

        const tier = service.pricingTiers?.[0];
        const price = getPrice(service);

        return (
          <div
            key={service._id}
            className={`relative bg-white border-2 rounded-[20px] p-6 flex flex-col cursor-pointer transition-all duration-300 ${
              isPremium
                ? "border-yellow-500 shadow-[0_4px_16px_rgba(245,158,11,0.1)] hover:shadow-[0_8px_24px_rgba(245,158,11,0.2)]"
                : "border-gray-200 hover:border-blue-600 hover:shadow-xl hover:-translate-y-1"
            }`}
          >
            {isPremium && (
              <span className="absolute top-4 right-4 px-3 py-1 bg-yellow-500 text-white text-[11px] font-bold uppercase tracking-wide rounded-full">
                Premium
              </span>
            )}

            <div className="flex justify-between items-start mb-5">
              <div
                className={`w-14 h-14 rounded-[14px] flex items-center justify-center shadow-sm ${
                  isPremium
                    ? "bg-yellow-100 text-yellow-500"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                <img
                  src={service.iconUrl}
                  alt={service.name}
                  className="w-7 h-7"
                />
              </div>

              {isInstant && (
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[11px] font-bold uppercase tracking-wide rounded-full">
                  Instant
                </span>
              )}
            </div>

            <h3 className="text-[20px] font-bold text-gray-900 mb-2">
              {service.name}
            </h3>

            <p className="text-[14px] text-gray-500 leading-[1.6] mb-5 flex-1">
              {service.description}
            </p>

            <div className="flex justify-between items-center pt-5 border-t-2 border-gray-200">
              <div>
                <div className="text-[12px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                  Starting from
                </div>

                <div className="text-[22px] font-bold text-gray-900">
                  {service.currency} {price}
                  {tier?.HOURLY && (
                    <span className="text-sm font-medium text-gray-500 ml-1">
                      /hr
                    </span>
                  )}
                  {tier?.PER_DAY && (
                    <span className="text-sm font-medium text-gray-500 ml-1">
                      /day
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() =>
                  navigate(`/servicetierselection/${service._id}`)
                }
                className="px-6 py-[10px] bg-blue-600 text-white text-[14px] font-bold rounded-full transition-all duration-200 hover:bg-blue-700"
              >
                Select
              </button>
            </div>
          </div>
        );
      })}
       <CustomQuote/>
    </div>
  );
}
