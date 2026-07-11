import { useMemo, useState } from "react";
import { useServiceCategory } from "@/features/Bookings/presentation/hooks/useServiceCategory";
import { useSearchStore } from "@/features/core/store/auth";
import { useNavigate, useParams } from "react-router-dom";
import CustomQuote from "./GetCustomQuote";
import { Image } from "@/components/input";
import Button from "@/components/input/Button";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import CommonCard from "@/components/common/CommonCards";
import { useLanguage } from "@/features/context/LanguageContext";
import { getPrice } from "../utils/getprice";
import { FavoriteIcon } from "@/components/icons";

import { useAddFavoriteService } from "@/features/Favorites/presentation/hooks/useAddFavorites";
import { useRemoveFavoriteService } from "@/features/Favorites/presentation/hooks/useDeleteFavorites";
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
  const { t } = useLanguage();

  const { data: apiResponse, isPending, error } = useServiceCategory();

 const [favorites, setFavorites] = useState<string[]>([]);

   const addFavoriteMutation = useAddFavoriteService();
   const removeFavoriteMutation = useRemoveFavoriteService();

    const toggleFavorite = (serviceId: string) => {
      if (favorites.includes(serviceId)) {
        removeFavoriteMutation.mutate(serviceId, {
          onSuccess: () => {
            setFavorites((prev) =>
              prev.filter((id) => id !== serviceId)
            );
          },
        });
      } else {
        addFavoriteMutation.mutate(serviceId, {
          onSuccess: () => {
            setFavorites((prev) => [...prev, serviceId]);
          },
        });
      }
    };

  // Flatten services
  const services = useMemo(() => {
    return apiResponse?.flatMap((category: any) => category.services) ?? [];
  }, [apiResponse]);

  if (isPending) {
    return <CommonSpinner />;
  }

  if (error) {
    return <p className="text-red-500">Failed to load services.</p>;
  }

  // Category filter
  let filteredServices = services.filter(
    (service: any) => service.category?.[0]?._id === id
  );

  // Search filter
  if (searchTerm?.trim()) {
    filteredServices = filteredServices.filter(
      (service: any) =>
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Filters
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

  // Sorting
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
            tier.commissionType === "PERCENTAGE" &&
            tier.commissionValue >= 20
        );

        const isInstant = service.pricingTiers?.some(
          (tier: any) => tier.HOURLY || tier.PER_DAY
        );

        const tier = service.pricingTiers?.[0];
        const price = getPrice(service);

        const isFavorite = favorites.includes(service._id);

        return (
          <CommonCard
            key={service._id}
            className={`group relative h-full cursor-pointer overflow-hidden rounded-[20px] border-2 transition-all duration-300 ${
              isPremium
                ? "border-yellow-500 shadow-[0_4px_16px_rgba(245,158,11,0.1)] hover:shadow-[0_8px_24px_rgba(245,158,11,0.2)]"
                : "border-gray-200 hover:-translate-y-1 hover:border-blue-600 hover:shadow-xl"
            }`}
            contentClassName="flex h-full flex-col p-6"
          >
            {/* Favorite */}
           <Button
  type="button"
  disabled={
    addFavoriteMutation.isPending ||
    removeFavoriteMutation.isPending
  }
  onClick={(e) => {
    e.stopPropagation();
    toggleFavorite(service._id);
  }}
  className="absolute top-4 right-4 z-10 p-2"
>
  <FavoriteIcon
    className={`h-6 w-6 transition-all duration-200 ${
      isFavorite
        ? "fill-red-500 text-red-500"
        : "fill-none text-gray-400 hover:text-red-500"
    }`}
  />
              </Button>

            {isPremium && (
              <span className="absolute left-4 top-4 rounded-full bg-yellow-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                {t.servicedetailpage.Premium}
              </span>
            )}

            <div className="mb-5 flex items-start justify-between mt-8">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-[14px] shadow-sm ${
                  isPremium
                    ? "bg-yellow-100 text-yellow-500"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                <Image
                  src={service.iconUrl}
                  alt={service.name}
                  className="h-7 w-7"
                />
              </div>

              {isInstant && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-600">
                  {t.servicedetailpage.Instant}
                </span>
              )}
            </div>

            <h3 className="mb-2 text-xl font-bold text-gray-900">
              {service.name}
            </h3>

            <p className="mb-5 flex-1 text-sm leading-6 text-gray-500">
              {service.description}
            </p>

            <div className="mt-auto flex items-center justify-between border-t-2 border-gray-200 pt-5">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-400">
                  {t.servicedetailpage["Starting from"]}
                </p>

                <div className="text-[22px] font-bold text-gray-900">
                  {service.currency} {price}
                  <span className="ml-1 text-sm font-medium text-gray-500">
                    {tier?.HOURLY
                      ? t.common["/hr"]
                      : tier?.PER_DAY
                      ? t.common["/day"]
                      : ""}
                  </span>
                </div>
              </div>

              <Button
                onClick={() =>
                  navigate(`/servicetierselection/${service._id}`)
                }
                className="rounded-full bg-blue-600 px-6 py-[10px] text-sm font-bold text-white hover:bg-blue-700"
              >
                {t.servicedetailpage.Select}
              </Button>
            </div>
          </CommonCard>
        );
      })}

      <CustomQuote />
    </div>
  );
}