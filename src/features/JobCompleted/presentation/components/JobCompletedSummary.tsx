import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import { useLanguage } from "@/features/context/LanguageContext";

import CommonCard from "@/components/common/CommonCards";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";
import { formatWorkHours } from "@/features/Bookings/presentation/utils/formathours";
import { formatDates } from "@/components/utils/formatdates";

export default function JobCompletedSummary({
  booking,
}: {
  booking: Booking;
}) {
  const { serviceTiers, services } = useServices();
  const { t, isRTLOrder } = useLanguage();

  // Service
  const serviceId =
    typeof booking.serviceId === "string"
      ? booking.serviceId
      : booking.serviceId?._id;

  const service =
    booking.service?.name ??
    (typeof booking.serviceId === "object"
      ? booking.serviceId?.name
      : services.find((s) => s._id === serviceId)?.name) ??
    "—";

  // Service Tier
  const serviceTierId =
    typeof booking.serviceTierId === "string"
      ? booking.serviceTierId
      : booking.serviceTierId?._id;

  const tierName =
    booking.serviceTier?.displayName ??
    serviceTiers?.find(
      (tier) =>
        String(tier._id) === String(serviceTierId) ||
        String(tier.tierId) === String(serviceTierId)
    )?.displayName ??
    "—";

  const price =
    booking.actualValues?.finalAmount?.toFixed(2) ??
    booking.finalAmount?.toFixed(2) ??
    booking.totalCost?.toFixed(2) ??
    "0.00";

  const currency = booking.currency || "SAR";
   const isHourly = booking.pricingMode === "HOURLY";
    const isPerDay = booking.pricingMode === "PER_DAY";

    const workHours = booking.actualValues?.workHours ?? 0;
    const workDays = booking.actualValues?.workDays ?? 0;

    const duration = isHourly
      ? workHours > 0
        ? formatWorkHours(workHours)
        : "—"
      : isPerDay
        ? `${workDays} ${
            workDays === 1
              ? (t.common.day ?? "Day")
              : (t.common.days ?? "Days")
          }`
        : "—";

    const summaryItems = [
      {
        label: t.jobcompletedpage.serviceType,
        value: service,
      },
      {
        label: t.jobcompletedpage.serviceTier,
        value: tierName,
      },
      {
        label: t.jobcompletedpage.date,
        value: booking.schedule?.startDateTime
          ? formatDates(booking.schedule.startDateTime)
          : "N/A",
        isLTR: true,
      },
      {
        label: t.jobcompletedpage.duration,
        value: duration,
      },
    ];

  const displayItems = isRTLOrder
    ? [
        summaryItems[1],
        summaryItems[0],
        summaryItems[3],
        summaryItems[2],
      ]
    : summaryItems;

  return (
    <CommonCard>
      {/* Header */}
      <div
        className={`flex justify-between mb-6 ${
          isRTLOrder ? "flex-row-reverse" : ""
        }`}
      >
        <h2 className="text-lg font-bold text-gray-900">
          {t.jobcompletedpage.serviceSummary}
        </h2>

        <span className="text-emerald-600 font-semibold">
          {booking.status}
        </span>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayItems.map((item, index) => (
          <div
            key={index}
            className={`bg-gray-50 p-4 rounded-xl ${
              isRTLOrder ? "flex-row-reverse" : ""
            }`}
          >
            <div className="text-xs text-gray-500">{item.label}</div>

            <div
              dir={item.isLTR ? "ltr" : undefined}
              style={
                item.isLTR
                  ? {
                      direction: "ltr",
                      unicodeBidi: "plaintext",
                    }
                  : undefined
              }
              className={`font-semibold break-words ${
                item.isLTR && isRTLOrder ? "text-right" : ""
              }`}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 my-6" />

      {/* Total */}
      <div
        className={`flex justify-between items-center ${
          isRTLOrder ? "flex-row-reverse" : ""
        }`}
      >
        <span className="font-semibold">
          {t.common.totalPaid}
        </span>

        <span
          dir="ltr"
          style={{
            direction: "ltr",
            unicodeBidi: "plaintext",
          }}
          className={`text-emerald-600 font-bold ${
            isRTLOrder ? "text-left" : ""
          }`}
        >
          {currency} {price}
        </span>
      </div>
    </CommonCard>
  );
}