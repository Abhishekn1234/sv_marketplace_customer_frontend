"use client";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Service } from "@/features/Bookings/domain/entities/service.types";
import { getCategoryNames } from "./utils/getcategoryname";
import FavoritesHeader from "./components/FavoritesHeader";
import FavoritesEmptyState from "./components/FavoritesEmptyState";
import ServiceFavoriteCard from "./components/ServiceFavoriteCard";


const DUMMY_SERVICES: Service[] = [
  {
    _id: "1",
    name: "Instagram & TikTok Ads Campaign Setup",
    slug: "instagram-tiktok-ads-setup",
    category: [{ _id: "c1", name: "Paid Social" } as any],
    description: "Full funnel ad setup across Meta and TikTok, from targeting to creative.",
    currency: "USD",
    pricingTiers: [{ _id: "p1", name: "Basic", price: 340 } as any],
    isActive: true,
    avgRating: 4.9,
    totalRatings: 214,
    createdAt: "2026-06-20T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=400&auto=format&fit=crop",
  },
  {
    _id: "2",
    name: "Full SEO Content Audit & Roadmap",
    slug: "seo-content-audit",
    category: [{ _id: "c2", name: "SEO" } as any],
    description: "Technical and content audit with a prioritized 90 day roadmap.",
    currency: "USD",
    pricingTiers: [{ _id: "p2", name: "Standard", price: 260 } as any],
    isActive: true,
    avgRating: 4.8,
    totalRatings: 132,
    createdAt: "2026-06-15T00:00:00Z",
    updatedAt: "2026-06-28T00:00:00Z",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1571677246347-5040036b95cc?q=80&w=400&auto=format&fit=crop",
  },
  {
    _id: "3",
    name: "Email Marketing Funnel (Welcome + Nurture)",
    slug: "email-marketing-funnel",
    category: [{ _id: "c3", name: "Email" } as any],
    description: "5 part welcome sequence plus an evergreen nurture track.",
    currency: "USD",
    pricingTiers: [{ _id: "p3", name: "Basic", price: 180 } as any],
    isActive: true,
    avgRating: 4.7,
    totalRatings: 88,
    createdAt: "2026-06-01T00:00:00Z",
    updatedAt: "2026-06-20T00:00:00Z",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?q=80&w=400&auto=format&fit=crop",
  },
  {
    _id: "4",
    name: "Influencer Outreach & Negotiation Package",
    slug: "influencer-outreach",
    category: [{ _id: "c4", name: "Influencer" } as any],
    description: "Sourcing, vetting, and rate negotiation with 10 creators.",
    currency: "USD",
    pricingTiers: [{ _id: "p4", name: "Standard", price: 420 } as any],
    isActive: false,
    avgRating: 5.0,
    totalRatings: 61,
    createdAt: "2026-05-20T00:00:00Z",
    updatedAt: "2026-06-01T00:00:00Z",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400&auto=format&fit=crop",
  },
  {
    _id: "5",
    name: "Brand Identity & Style Guide Design",
    slug: "brand-identity-design",
    category: [{ _id: "c5", name: "Branding" } as any],
    description: "Logo system, color, type, and a full usage guide.",
    currency: "USD",
    pricingTiers: [{ _id: "p5", name: "Premium", price: 560 } as any],
    isActive: true,
    avgRating: 4.9,
    totalRatings: 305,
    createdAt: "2026-05-10T00:00:00Z",
    updatedAt: "2026-05-30T00:00:00Z",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=400&auto=format&fit=crop",
  },
  {
    _id: "6",
    name: "TikTok Organic Growth Strategy",
    slug: "tiktok-organic-growth",
    category: [{ _id: "c6", name: "Organic Social" } as any],
    description: "Content pillars, posting cadence, and hook frameworks.",
    currency: "USD",
    pricingTiers: [{ _id: "p6", name: "Basic", price: 150 } as any],
    isActive: true,
    avgRating: 4.6,
    totalRatings: 47,
    createdAt: "2026-04-28T00:00:00Z",
    updatedAt: "2026-05-05T00:00:00Z",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400&auto=format&fit=crop",
  },
];

export default function FavoritesPage() {
  const [services, setServices] = useState<Service[]>(DUMMY_SERVICES);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filters = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => getCategoryNames(s).forEach((c) => set.add(c)));
    return ["All", ...Array.from(set)];
  }, [services]);

  const removeFavorite = (id: string) => {
    setServices((prev) => prev.filter((s) => s._id !== id));
  };

  const handleBookNow = (service: Service) => {
    navigate(`/servicetierselection/${service.pricingTiers.map((tier) => tier._id)}`);
  };

  const filtered = services.filter((s) => {
    const categories = getCategoryNames(s);
    const matchesFilter = activeFilter === "All" || categories.includes(activeFilter);
    const matchesQuery =
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div
      className="min-h-screen w-full text-[#1B3A5C]"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        <FavoritesHeader
          count={services.length}
          query={query}
          onQueryChange={setQuery}
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {filtered.length === 0 ? (
          <FavoritesEmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filtered.map((service) => (
              <ServiceFavoriteCard
                key={service._id}
                service={service}
                onRemoveFavorite={removeFavorite}
                onBookNow={handleBookNow}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}