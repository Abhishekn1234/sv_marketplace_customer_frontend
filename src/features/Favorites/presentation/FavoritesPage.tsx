"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";

import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import { Service } from "@/features/Bookings/domain/entities/service.types";

import FavoritesHeader from "./components/FavoritesHeader";
import FavoritesEmptyState from "./components/FavoritesEmptyState";
import ServiceFavoriteCard from "./components/ServiceFavoriteCard";
import { getCategoryNames } from "./utils/getcategoryname";
import { useInfiniteFavoriteServices } from "./hooks/useInfiniteFavoriteServices";
import { useRemoveFavoriteService } from "./hooks/useDeleteFavorites";
import { useLanguage } from "@/features/context/LanguageContext";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { t, localize, lang } = useLanguage();

  const [activeFilter, setActiveFilter] = useState(
    t.Bookingspage.status.All
  );
  const [query, setQuery] = useState("");

  const { categories,services:service } = useServices({
    language: lang,
  });
 console.log(service);
  const {
    data,
    isPending,
    isFetching,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteFavoriteServices(query);

  const removeFavoriteMutation = useRemoveFavoriteService();

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    setActiveFilter(t.Bookingspage.status.All);
  }, [lang]);

  // Category lookup
//   const categoryMap = useMemo(() => {
//   return new Map(
//     (categories ?? []).map((category) => [category._id, category])
//   );
// }, [categories]);
const serviceMap = useMemo(() => {
  return new Map(
    (service ?? []).map((item) => [item._id, item])
  );
}, [service]);
// Merge favorite services with localized categories
const services = useMemo(() => {
  const favoriteServices =
    data?.pages.flatMap((page) => page.data as Service[]) ?? [];

  return favoriteServices.map((favorite) => {
    const localizedService = serviceMap.get(favorite._id);

    if (!localizedService) {
      return favorite;
    }

    return {
      ...favorite,

      // Replace with localized values from useServices
      name: localizedService.name,
      description: localizedService.description,
      category: localizedService.category,

      // Keep favorite-specific fields
      isFavorited: favorite.isFavorited,
      avgRating: favorite.avgRating,
      totalRatings: favorite.totalRatings,
      pricingTiers: favorite.pricingTiers,
    };
  });
}, [data, serviceMap]);

const filters = useMemo(() => {
  const set = new Set<string>();

  services.forEach((service) => {
    getCategoryNames(service, localize).forEach((category) =>
      set.add(category)
    );
  });

  return [t.Bookingspage.status.All, ...Array.from(set)];
}, [services, localize, t]);

useEffect(() => {
  setActiveFilter(t.Bookingspage.status.All);
}, [t.Bookingspage.status.All]);

const filtered = useMemo(() => {
  return services.filter((service) => {
    const categoryNames = getCategoryNames(service, localize);

    return (
      activeFilter === t.Bookingspage.status.All ||
      categoryNames.includes(activeFilter)
    );
  });
}, [services, activeFilter, localize, t]);
  const removeFavorite = (id: string) => {
    removeFavoriteMutation.mutate(id);
  };

  const handleBookNow = (service: Service) => {
    navigate(`/servicetierselection/${service._id}`);
  };

  if (isPending && !data) {
    return <CommonSpinner center />;
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Something went wrong.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full text-[#1B3A5C]"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-10">
        <FavoritesHeader
          count={services.length}
          query={query}
          onQueryChange={setQuery}
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {isFetching && !isFetchingNextPage && (
          <div className="flex justify-center py-3">
            <CommonSpinner />
          </div>
        )}

        {filtered.length === 0 ? (
          <FavoritesEmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {filtered.map((service) => (
                <ServiceFavoriteCard
                  key={service._id}
                  service={service}
                  onRemoveFavorite={removeFavorite}
                  onBookNow={handleBookNow}
                />
              ))}
            </div>

            <div
              ref={ref}
              className="flex min-h-[80px] items-center justify-center py-6"
            >
              {isFetchingNextPage && <CommonSpinner center />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}