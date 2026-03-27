"use client";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatDates } from "@/features/Home/presentation/helpers/formatdatestring";
import { useBookingHistory } from "@/features/Bookings/presentation/hooks/useBookingHistory";
import { useLanguage } from "@/features/context/LanguageContext";

export default function JobTrackingServiceDetails() {
  const { bookingId } = useParams();
  const { data } = useBookingHistory();
 const {t}=useLanguage();
  const [coordinates, setCoordinates] = useState("Loading...");

  const bookings = data?.pages.flatMap((page) => page.data) ?? [];
  const booking = bookings.find((b) => b._id === bookingId);

  useEffect(() => {
    if (!booking?.location?.coordinates) {
      setCoordinates("No coordinates");
      return;
    }

    const lat = booking.location.coordinates[1];
    const lng = booking.location.coordinates[0];

    setCoordinates(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
  }, [booking]);

  const serviceDetails = [
    { label: t.jobtrackingpage.serviceDetails.serviceType, value: booking?.service?.name || "—" },
    { label: t.jobtrackingpage.serviceDetails.serviceTier, value: booking?.serviceTier?.displayName || "—" },
    {
      label: t.jobtrackingpage.serviceDetails.dateTime,
      value: booking?.schedule?.startDateTime
        ? formatDates(booking.schedule.startDateTime)
        : "—",
    },
    {
      label: t.jobtrackingpage.serviceDetails.location,
      value: coordinates,
      isSmall: true,
    },
    {
      label:t.jobtrackingpage.serviceDetails.totalPrice,
      value: booking ? `${booking.currency} ${booking.amount}` : "—",
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
            {/* Left Label */}
            <span className="text-sm font-medium text-gray-500 shrink-0">
              {item.label}
            </span>

            {/* Right Value */}
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