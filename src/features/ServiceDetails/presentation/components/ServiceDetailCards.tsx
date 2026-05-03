import { useMemo } from "react";
import { useServiceCategory } from "@/features/Bookings/presentation/hooks/useServiceCategory";
import { useSearchStore } from "@/features/core/store/auth";
import { useNavigate, useParams } from "react-router-dom";
import CustomQuote from "./GetCustomQuote";
import { Image } from "@/components/input";
import Button from "@/components/input/Button";

interface Props {
  activeFilter: string;
  sortBy: string;
}

export default function ServiceDetailCards({ activeFilter, sortBy }: Props) {
  const { id } = useParams();
  const { searchTerm } = useSearchStore();
  const navigate = useNavigate();

  const { data: apiResponse, isPending, error } = useServiceCategory();

  // ✅ Flatten services from categories
  const services = useMemo(() => {
        return apiResponse?.flatMap((category: any) => category.services) ?? [];
      }, [apiResponse]);

  if (isPending) {
    return <p className="text-gray-500">Loading services...</p>;
  }

  if (error) {
    return <p className="text-red-500">Failed to load services.</p>;
  }

  // ✅ Filter by category id
  let filteredServices = services.filter(
    (service: any) => service.category?.[0]?._id === id
  );

  // ✅ Search filter
  if (searchTerm?.trim()) {
    filteredServices = filteredServices.filter(
      (service: any) =>
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // ✅ Custom filters
  if (activeFilter === "Popular") {
    filteredServices = filteredServices.filter(
      (service: any) => service.avgRating >= 4
    );
  }

  if (activeFilter === "Same Day") {
    filteredServices = filteredServices.filter((service: any) =>
      service.pricingTiers?.some((tier: any) => tier.HOURLY)
    );
  }

 if (activeFilter === "Eco Friendly") {
  filteredServices = filteredServices.filter((service: any) =>
    service.description?.toLowerCase().includes("eco")
  );
}

  // ✅ Get price helper
  const getPrice = (service: any) => {
    const tier = service.pricingTiers?.[0];
    if (!tier) return 0;
    if (tier.HOURLY) return tier.HOURLY.ratePerHour;
    if (tier.PER_DAY) return tier.PER_DAY.ratePerDay;
    return 0;
  };

  // ✅ Sorting
  if (sortBy === "Price Low To High") {
    filteredServices = [...filteredServices].sort(
      (a: any, b: any) => getPrice(a) - getPrice(b)
    );
  }

  if (sortBy === "Price High To Low") {
    filteredServices = [...filteredServices].sort(
      (a: any, b: any) => getPrice(b) - getPrice(a)
    );
  }

  if (sortBy === "Recommended") {
    filteredServices = [...filteredServices].sort(
      (a: any, b: any) => b.avgRating - a.avgRating
    );
  }

  if (!filteredServices.length) {
    return (
      <p className="text-gray-500">
        {searchTerm
          ? `No results found for "${searchTerm}"`
          : "No services found."}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 mb-8">
      {filteredServices.map((service: any) => {
        const isPremium = service.pricingTiers?.some(
          (tier: any) =>
            tier.commissionType === "PERCENTAGE" && tier.commissionValue >= 20
        );

        const isInstant = service.pricingTiers?.some(
          (tier: any) => tier.HOURLY || tier.PER_DAY
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
                <Image
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

                  <span className="text-sm font-medium text-gray-500 ml-1">
                    {tier?.HOURLY ? "/hr" : tier?.PER_DAY ? "/day" : ""}
                  </span>
                </div>
              </div>

              <Button
                onClick={() =>
                  navigate(`/servicetierselection/${service._id}`)
                }
                className="px-6 py-[10px] bg-blue-600 text-white text-[14px] font-bold rounded-full transition-all duration-200 hover:bg-blue-700"
              >
                Select
              </Button>
            </div>
          </div>
        );
      })}

      <CustomQuote />
    </div>
  );
}