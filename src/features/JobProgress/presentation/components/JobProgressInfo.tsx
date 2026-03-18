import { useBookingHistory } from "@/features/Bookings/presentation/hooks/useBookingHistory";
import { useParams } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";
import { reverseGeocode } from "@/features/utils/reverse";

export function JobProgressInfo() {
  const { data } = useBookingHistory();
  const { bookingId } = useParams();
  const [address, setAddress] = useState("Loading...");

  const booking = useMemo(() => {
    if (!data?.pages) return null;
    const all = data.pages.flatMap((p: any) => p.data || []);
    return all.find((b: any) => b._id === bookingId);
  }, [data, bookingId]);

  const serviceName = booking?.service?.name || "N/A";
  const serviceTier = booking?.serviceTier?.displayName || "N/A";

  const total = booking?.amount ?? 0;
  const currency = booking?.currency || "SAR";

  const pricingMode = booking?.pricingMode;
  const estimatedHours = booking?.schedule?.estimatedHours ?? 0;
  const estimatedDays = booking?.actualWorkDays ?? 0;

  let basePrice = 0;

  if (pricingMode === "HOURLY") {
    basePrice = estimatedHours ? total / estimatedHours : total;
  } else if (pricingMode === "DAILY") {
    basePrice = estimatedDays ? total / estimatedDays : total;
  } else {
    basePrice = total;
  }

  const startDate = booking?.schedule?.startDateTime
    ? new Date(booking.schedule.startDateTime).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  let duration = "N/A";

  if (booking?.startedAt && booking?.completedAt) {
    const start = new Date(booking.startedAt).getTime();
    const end = new Date(booking.completedAt).getTime();

    if (!isNaN(start) && !isNaN(end)) {
      const diff = end - start;
      const mins = Math.floor(diff / (1000 * 60));
      const hrs = Math.floor(mins / 60);
      const remaining = mins % 60;

      duration = `${hrs > 0 ? `${hrs} hr ` : ""}${remaining} min`;
    }
  } else if (booking?.startedAt && !booking?.completedAt) {
    duration = "Ongoing";
  }

  const lat = booking?.location?.coordinates?.[1];
  const lng = booking?.location?.coordinates?.[0];

  useEffect(() => {
    const fetchAddress = async () => {
      if (lat && lng) {
        try {
          const place = await reverseGeocode(lat, lng);
          setAddress(place || "Location not found");
        } catch {
          setAddress("Failed to load location");
        }
      }
    };

    fetchAddress();
  }, [lat, lng]);

  return (
    <div className="flex flex-col gap-5 sticky top-6">
      <div className="bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm">
        <h3 className="text-[16px] font-bold text-gray-900 mb-5">
          Service Summary
        </h3>

        {[
          ["Service Type", serviceName],
          ["Service Tier", serviceTier],
          ["Base Price", `${currency} ${basePrice.toFixed(2)}`],
        ].map(([label, value], i) => (
          <div
            key={i}
            className="flex justify-between py-2 border-b border-gray-100"
          >
            <span className="text-sm text-gray-500 font-medium">
              {label}
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {value}
            </span>
          </div>
        ))}

        <div className="flex justify-between pt-4 mt-2 border-t-2 border-gray-200">
          <span className="text-sm text-gray-500 font-medium">Total</span>
          <span className="text-[18px] font-bold text-blue-600">
            {currency} {total}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm">
        <h3 className="text-[16px] font-bold text-gray-900 mb-4">
          Service Info
        </h3>

        <div className="space-y-4 text-sm">
          <div>
            <div className="text-gray-500 text-[13px]">Date</div>
            <div className="font-semibold text-gray-900">
              {startDate}
            </div>
          </div>

          <div>
            <div className="text-gray-500 text-[13px]">Duration</div>
            <div className="font-semibold text-gray-900">
              {duration}
            </div>
          </div>

          <div>
            <div className="text-gray-500 text-[13px]">Location</div>
            <div className="font-semibold text-gray-900">
              {address}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}