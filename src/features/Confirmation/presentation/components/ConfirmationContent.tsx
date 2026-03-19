"use client";

import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { useEffect, useState } from "react";
import { getPlaceNameFromCoords } from "@/features/utils/reverse";

import ConfirmationHeader from "./ConfirmationHeader";
import ConfirmationInfo from "./ConfirmationInfo";
import ConfirmationCard from "./ConfirmationCard";

export default function ConfirmationContent() {
  const { bookings, error, loading } = useBookings();
  const data = bookings?.[0];

  const [placeName, setPlaceName] = useState("Loading...");
  const [initialLoading, setInitialLoading] = useState(true);

  // 🔹 Fetch location
  useEffect(() => {
    if (!data?.location?.coordinates?.length) return;

    const [lng, lat] = data.location.coordinates;

    getPlaceNameFromCoords(lat, lng)
      .then((place) => setPlaceName(place || "Location not found"))
      .catch(() => setPlaceName("Location not available"));
  }, [data?.location?.coordinates]);

  // 🔹 Smooth loader
  useEffect(() => {
    if (!loading && data) {
      const t = setTimeout(() => setInitialLoading(false), 600);
      return () => clearTimeout(t);
    }
  }, [loading, data]);

  if (error) {
    return <p className="text-red-500 text-center mt-10">Error loading booking</p>;
  }

  if (
    initialLoading ||
    loading ||
    !data ||
    (!data?.serviceTier && !data?.serviceTierId)
  ) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center px-4 py-10 bg-gray-50 min-h-screen">
      <div className="max-w-[700px] w-full space-y-6">

        {/* 🔹 Header */}
        <ConfirmationHeader data={data} />

        {/* 🔹 Info */}
        <ConfirmationInfo />

        {/* 🔹 Card */}
        <ConfirmationCard data={data} placeName={placeName} />

      </div>
    </main>
  );
}