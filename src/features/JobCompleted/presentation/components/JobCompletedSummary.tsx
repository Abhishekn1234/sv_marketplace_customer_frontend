import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import { useLanguage } from "@/features/context/LanguageContext";
import { formatDates } from "@/features/Home/presentation/helpers/formatdatestring";
import CommonCard from "@/components/common/CommonCards";

export default function JobCompletedSummary({ booking }: any) {
  const { serviceTiers, services } = useServices();
  const { t, isRTLOrder } = useLanguage();

  const serviceName =
    booking.serviceId?.name ?? booking.service?.name;

  const service =
    serviceName ??
    services.find((s) => s._id === booking.serviceId)?.name;

  const pricingTier = serviceTiers?.find(
    (tier) =>
      String(tier._id) === String(booking?.serviceTierId) ||
      String(tier.tierId) === String(booking?.serviceTierId)
  );

  const tierName = pricingTier?.displayName || "—";

  const price = booking?.totalCost;
  const currency = booking?.currency || "SAR";

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
    value:
      formatDates(
        booking?.schedule?.startDateTime
      ) || "N/A",
    isLTR: true,
  },
  {
    label: t.jobcompletedpage.duration,
    value: booking.schedule?.estimatedHours,
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
      {/* HEADER */}
      <div
        className={`flex justify-between mb-6 ${
          isRTLOrder ? "flex-row-reverse" : ""
        }`}
      >
        <h2 className="text-lg font-bold text-gray-900">
          {t.jobcompletedpage.serviceSummary}
        </h2>

        <span className="text-emerald-600 font-semibold">
          {booking?.status}
        </span>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayItems.map((item, index) => (
          <div
            key={index}
            className={`bg-gray-50 p-4 rounded-xl ${
              isRTLOrder ? "flex-row-reverse" : ""
            }`}
          >
            <div className="text-xs text-gray-500">
              {item.label}
            </div>

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
                  item.isLTR && isRTLOrder
                    ? "text-right"
                    : ""
                }`}
              >
                {item.value}
              </div>
          </div>
        ))}
      </div>

      {/* DIVIDER */}
      <div className="h-px bg-gray-200 my-6" />

      {/* TOTAL */}
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