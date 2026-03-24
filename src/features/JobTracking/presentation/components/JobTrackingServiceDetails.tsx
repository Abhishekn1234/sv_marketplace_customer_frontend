import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatDates } from "@/features/Home/presentation/helpers/formatdatestring";
import { useBookingHistory } from "@/features/Bookings/presentation/hooks/useBookingHistory";

export default function JobTrackingServiceDetails() {
  const { bookingId } = useParams();
  const { data } = useBookingHistory();

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
    { label: "Service Type", value: booking?.service?.name || "—" },
    { label: "Service Tier", value: booking?.serviceTier?.displayName || "—" },
    {
      label: "Date & Time",
      value: booking?.schedule?.startDateTime
        ? formatDates(booking.schedule.startDateTime)
        : "—",
    },
    {
      label: "Location",
      value: coordinates,
      isSmall: true,
    },
    {
      label: "Total Price",
      value: booking ? `${booking.currency} ${booking.amount}` : "—",
      isPrice: true,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-5">
        Service Details
      </h3>

      <div className="flex flex-col divide-y divide-gray-100">
        {serviceDetails.map((item, idx) => (
          <div key={idx} className="flex justify-between items-start py-3">
            <span className="text-sm font-medium text-gray-500">{item.label}</span>
            <span
              className={`font-semibold text-right ${
                item.isSmall
                  ? "text-xs text-gray-700 max-w-[220px] break-words"
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