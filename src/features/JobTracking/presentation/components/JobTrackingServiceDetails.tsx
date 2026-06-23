"use client";

import { useEffect, useState, useMemo } from "react";
import { formatDates } from "@/features/Home/presentation/utils/formatdatestring";
import { useLanguage } from "@/features/context/LanguageContext";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import CommonCard from "@/components/common/CommonCards";

interface Props {
  booking: Booking | undefined;
  loading: boolean;
}

export default function JobTrackingServiceDetails({
  booking,
  loading,
}: Props) {
  const { t,isRTLOrder } = useLanguage();
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

  if (loading || !booking) {
    return (
      <CommonCard>
        <CommonSpinner size={16} />
      </CommonCard>
    );
  }
  const baseAmount = Number(booking.amount || 0);
const vatAmount = Number(booking.vatAmount || 0);
const finalAmount = Number(booking.totalCost || 0);

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

  // PRICE BREAKDOWN
  {
    label: t.jobtrackingpage.serviceDetails.basePrice,
    value: `${booking.currency} ${baseAmount.toFixed(2)}`,
  },
  {
    label: t.jobtrackingpage.serviceDetails.vatRate,
    value: `${booking.currency} ${vatAmount.toFixed(2)}`,
    isVat: true,
  },
  {
    label: t.jobtrackingpage.serviceDetails.totalPrice,
    value: `${booking.currency} ${finalAmount.toFixed(2)}`,
    isPrice: true,
  },
];

  return (
    <CommonCard
      title={t.jobtrackingpage.serviceDetails.title}
    >
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
          dir="ltr"
          style={{
            direction: "ltr",
            unicodeBidi: "plaintext",
          }}
          className={`font-semibold break-words min-w-0 ${
            isRTLOrder ? "text-left" : "text-right"
          } ${
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
    </CommonCard>
  );
}