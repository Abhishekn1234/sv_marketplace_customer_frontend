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

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { t, localize } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");

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

  const services = useMemo<Service[]>(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const filters = useMemo(() => {
    const categories = new Set<string>();

    services.forEach((service) => {
      getCategoryNames(service, localize).forEach((category) =>
        categories.add(category)
      );
    });

    return ["All", ...Array.from(categories)];
  }, [services]);

  const filtered = useMemo(() => {
    return services.filter((service) => {
      const categories = getCategoryNames(service, localize);

      return (
        activeFilter === "All" ||
        categories.includes(activeFilter)
      );
    });
  }, [services, activeFilter]);

  const removeFavorite = (id: string) => {
    removeFavoriteMutation.mutate(id);
  };

  const handleBookNow = (service: Service) => {
    navigate(`/servicetierselection/${service._id}`);
  };

  // Only show full-page loader on first load
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

        {/* Small loader while searching */}
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