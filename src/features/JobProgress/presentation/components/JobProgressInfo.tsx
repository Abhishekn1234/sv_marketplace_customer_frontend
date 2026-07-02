import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import { useLanguage } from "@/features/context/LanguageContext";
import { useMemo } from "react";
import CommonCard from "@/components/common/CommonCards";

export function JobProgressInfo({ booking }: any) {
  const { services, serviceTiers } = useServices();
  const { t } = useLanguage();

  const serviceMap = useMemo(() => {
    return new Map(services.map((s: any) => [s._id, s]));
  }, [services]);

  const tierMap = useMemo(() => {
    return new Map(serviceTiers.map((t: any) => [t._id, t]));
  }, [serviceTiers]);

  const service = serviceMap.get(booking?.serviceId);
  const serviceTier = tierMap.get(booking?.serviceTierId);

  const serviceName =
    booking?.serviceId?.name || service?.name || "N/A";

  const serviceTierName =
    serviceTier?.displayName ?? "N/A";

  const total = booking?.amount ?? 0;
  const currency = booking?.currency || "SAR";

  const pricingMode = booking?.pricingMode;
  const estimatedHours = booking?.schedule?.estimatedHours ?? 0;
  const estimatedDays = booking?.actualWorkDays ?? 0;
  let basePrice = 0;
  if (pricingMode === "HOURLY") {
    basePrice = estimatedHours ? total / estimatedHours : total;
  } else if (pricingMode === "PER_DAY") {
    basePrice = estimatedDays ? total / estimatedDays : total;
  } else {
    basePrice = total;
  }

  const startDate = booking?.schedule?.startDateTime
    ? new Date(booking.schedule.startDateTime).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
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

  const formattedCoordinates =
    lat != null && lng != null
      ? `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`
      : "No coordinates";

  return (
    <div className="flex flex-col gap-5 sticky top-6">
      
      {/* ================= SERVICE SUMMARY ================= */}
    <CommonCard className="p-6 rounded-2xl shadow-sm">
  <h3 className="text-lg font-bold text-gray-900 mb-5">
    {t.jobprogresspage.serviceSummary}
  </h3>

  {/* Service Details */}
  {[
    [t.jobprogresspage.serviceType, serviceName],
    [t.jobprogresspage.serviceTier, serviceTierName],
    [
      t.jobprogresspage.basePrice,
      `${currency} ${basePrice.toFixed(2)}`,
    ],
  ].map(([label, value], i) => (
    <div
      key={i}
      className="flex items-center justify-between py-3 border-b border-gray-100"
    >
      <span className="text-sm text-gray-500 font-medium">
        {label}
      </span>

      <span className="text-sm font-semibold text-gray-900 text-right">
        {value}
      </span>
    </div>
  ))}

  {/* Pricing Summary */}
  <div className="mt-4 space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">
        {t.jobtrackingpage.serviceDetails.vatRate}
      </span>

      <span className="font-medium text-gray-800">
        {currency} {booking?.vatAmount ?? 0}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">
        {t.jobtrackingpage.serviceDetails.basePrice}
      </span>

      <span className="font-medium text-gray-800">
        {currency} {total}
      </span>
    </div>

    <div className="border-t border-dashed border-gray-200 pt-4">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-gray-900">
          {t.jobtrackingpage.serviceDetails.totalPrice}
        </span>

        <span className="text-xl font-bold text-blue-600">
          {currency} {booking?.totalCost ?? total}
        </span>
      </div>
    </div>
  </div>
</CommonCard>
      {/* ================= SERVICE INFO ================= */}
      <CommonCard>
        <h3 className="text-[16px] font-bold text-gray-900 mb-4">
          {t.jobprogresspage.serviceInfo}
        </h3>

        <div className="space-y-4 text-sm">
          <div>
            <div className="text-gray-500 text-[13px]">
              {t.jobprogresspage.date}
            </div>
            <div className="font-semibold text-gray-900">
              {startDate}
            </div>
          </div>

          <div>
            <div className="text-gray-500 text-[13px]">
              {t.jobprogresspage.duration}
            </div>
            <div className="font-semibold text-gray-900">
              {duration}
            </div>
          </div>

          <div>
            <div className="text-gray-500 text-[13px]">
              {t.jobprogresspage.location}
            </div>
            <div className="font-semibold text-gray-900">
              {formattedCoordinates}
            </div>
          </div>
        </div>
      </CommonCard>
    </div>
  );
}