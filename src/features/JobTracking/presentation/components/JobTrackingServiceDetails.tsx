import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/features/context/LanguageContext";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import CommonCard from "@/components/common/CommonCards";
import { formatDates } from "@/components/utils/formatdates";

interface Props {
  booking: Booking | undefined;
  loading: boolean;
}

export default function JobTrackingServiceDetails({
  booking,
  loading,
}: Props) {
  const { t, isRTLOrder, localize, lang } = useLanguage();

  // ✅ Pass current language
  const {
    serviceTiers,
    services,
  } = useServices({
    language: lang,
  });

  const [coordinates, setCoordinates] = useState("Loading...");

  // -----------------------------
  // Service Tier
  // -----------------------------
  const tierName = useMemo(() => {
    if (!booking) return "—";

    const tierId =
      typeof booking.serviceTierId === "string"
        ? booking.serviceTierId
        : booking.serviceTierId?._id;

    const tier = serviceTiers.find((t) => t._id === tierId);

    return tier ? localize(tier.displayName) : "—";
  }, [serviceTiers, booking, lang]);

  // -----------------------------
  // Service Name
  // -----------------------------
  const serviceName = useMemo(() => {
    if (!booking) return "—";

    const serviceId =
      typeof booking.serviceId === "string"
        ? booking.serviceId
        : booking.serviceId?._id;

    const service = services.find((s) => s._id === serviceId);

    console.log("Language:", lang);
    console.log("Service:", service);

    return service ? localize(service.name) : "—";
  }, [services, booking, lang]);

  // -----------------------------
  // Coordinates
  // -----------------------------
  useEffect(() => {
    if (!booking?.location?.coordinates) {
      setCoordinates("No coordinates");
      return;
    }

    const [lng, lat] = booking.location.coordinates;

    setCoordinates(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
  }, [booking]);

  if (loading || !booking) {
    return (
      <CommonCard>
        <CommonSpinner size={16} />
      </CommonCard>
    );
  }

  const baseAmount = Number(
    booking.actualValues?.taxableAmount ??
      booking.estimatedValues?.taxableAmount ??
      0
  );

  const vatAmount = Number(
    booking.actualValues?.vatAmount ??
      booking.estimatedValues?.vatAmount ??
      0
  );

  const finalAmount = Number(
    booking.actualValues?.finalAmount ??
      booking.estimatedValues?.finalAmount ??
      0
  );

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
      label: t.jobtrackingpage.serviceDetails.basePrice,
      value: `${booking.currency} ${baseAmount.toFixed(2)}`,
    },
    {
      label: t.jobtrackingpage.serviceDetails.vatRate,
      value: `${booking.currency} ${vatAmount.toFixed(2)}`,
    },
    {
      label: t.jobtrackingpage.serviceDetails.totalPrice,
      value: `${booking.currency} ${finalAmount.toFixed(2)}`,
      isPrice: true,
    },
  ];

  return (
    <CommonCard title={t.jobtrackingpage.serviceDetails.title}>
      <div className="flex flex-col divide-y divide-gray-100">
        {serviceDetails.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-start gap-3 py-3"
          >
            <span className="text-sm font-medium text-gray-500">
              {item.label}
            </span>

            <span
              dir="ltr"
              style={{
                direction: "ltr",
                unicodeBidi: "plaintext",
              }}
              className={`font-semibold break-words ${
                isRTLOrder ? "text-left" : "text-right"
              } ${
                item.isSmall
                  ? "text-xs text-gray-700"
                  : item.isPrice
                  ? "text-base text-blue-600"
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