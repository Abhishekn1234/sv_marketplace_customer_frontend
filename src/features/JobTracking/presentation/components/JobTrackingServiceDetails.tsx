"use client";


import { useEffect, useState, useMemo } from "react";
import { formatDates } from "@/features/Home/presentation/helpers/formatdatestring";
import { useLanguage } from "@/features/context/LanguageContext";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";

interface Props {
  booking: Booking | undefined;
  loading: boolean;
}

export default function JobTrackingServiceDetails({
  booking,
  loading,
}: Props) {
  const { t } = useLanguage();
  const { serviceTiers, services } = useServices();

  const [coordinates, setCoordinates] = useState("Loading...");

  // -----------------------------
  // tier name
  // -----------------------------
  const tierName = useMemo(() => {
    if (!serviceTiers || !booking) return "—";

    const tierId =
      typeof booking.serviceTierId === "string"
        ? booking.serviceTierId
        : booking.serviceTierId?._id;

    const tier = serviceTiers.find((t) => t._id === tierId);

    return tier?.displayName || "—";
  }, [serviceTiers, booking]);

  // -----------------------------
  // service name
  // -----------------------------
  const serviceName = useMemo(() => {
    if (!services || !booking) return "—";

    const serviceId =
      typeof booking.serviceId === "string"
        ? booking.serviceId
        : booking.serviceId?._id;

    const service = services.find((s) => s._id === serviceId);

    return service?.name || "—";
  }, [services, booking]);

  // -----------------------------
  // coordinates
  // -----------------------------
  useEffect(() => {
    if (!booking?.location?.coordinates) {
      setCoordinates("No coordinates");
      return;
    }

    const lat = booking.location.coordinates[1];
    const lng = booking.location.coordinates[0];

    setCoordinates(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
  }, [booking]);

  // -----------------------------
  // loading
  // -----------------------------
  if (loading || !booking) {
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
        <p className="text-sm text-gray-500">
          Loading service details...
        </p>
      </div>
    );
  }

  // -----------------------------
  // UI
  // -----------------------------
  const serviceDetails = [
    {
      label: t.jobtrackingpage.serviceDetails.serviceType,
      value: serviceName,
    },
    {
      label: t.jobtrackingpage.serviceDetails.serviceTier,
      value: tierName,
    },
    {
      label: t.jobtrackingpage.serviceDetails.dateTime,
      value: booking.schedule?.startDateTime
        ? formatDates(booking.schedule.startDateTime)
        : "—",
    },
    {
      label: t.jobtrackingpage.serviceDetails.location,
      value: coordinates,
      isSmall: true,
    },
    {
      label: t.jobtrackingpage.serviceDetails.totalPrice,
      value: `${booking.currency} ${booking.totalCost}`,
      isPrice: true,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm w-full min-w-0">
      <h3 className="text-base font-bold text-gray-900 mb-5">
        {t.jobtrackingpage.serviceDetails.title}
      </h3>

      <div className="flex flex-col divide-y divide-gray-100">
        {serviceDetails.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-start gap-3 py-3 min-w-0"
          >
            <span className="text-sm font-medium text-gray-500 shrink-0">
              {item.label}
            </span>

            <span
              className={`font-semibold text-right break-words min-w-0 ${
                item.isSmall
                  ? "text-xs text-gray-700"
                  : item.isPrice
                  ? "text-blue-600 text-base"
                  : "text-sm text-gray-900"
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}