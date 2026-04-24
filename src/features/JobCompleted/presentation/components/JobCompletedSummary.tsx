
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import { useLanguage } from "@/features/context/LanguageContext";
import { formatDates } from "@/features/Home/presentation/helpers/formatdatestring";

export default function JobCompletedSummary({ booking }: any) {
  const {serviceTiers,services}=useServices();
  const {t}=useLanguage();
  const service = services?.find((s) => s._id === booking?.service)?.name || booking?.serviceId?.name;
  const pricingTier = serviceTiers?.find((tier) =>
    String(tier._id) === String(booking?.serviceTierId) ||
    String(tier.tierId) === String(booking?.serviceTierId)
  );
  const tierName = pricingTier?.displayName || "—";

 
 const price = booking?.totalCost;
  const currency = booking?.currency || "₹";
 console.log("Booking in summary:", booking);
 
  return (
    <div className="bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm">

      <div className="flex justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">
           {t.jobcompletedpage.serviceSummary}
        </h2>

        <span className="text-emerald-600 font-semibold">
        {booking?.status}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="text-xs text-gray-500">{t.jobcompletedpage.serviceType}</div>
          <div className="font-semibold">
           {service}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="text-xs text-gray-500">{t.jobcompletedpage.serviceTier}</div>
          <div className="font-semibold">
            {tierName}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="text-xs text-gray-500">{t.jobcompletedpage.date}</div>
          <div className="font-semibold">
          {formatDates(booking?.schedule?.startDateTime) || "N/A"}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="text-xs text-gray-500">{t.jobcompletedpage.duration}</div>
          <div className="font-semibold">
            {booking.schedule?.estimatedHours}
          </div>
        </div>

      

      </div>

      <div className="h-px bg-gray-200 my-6" />

      <div className="flex justify-between">
        <span className="font-semibold">Total Paid</span>
        <span className="text-emerald-600 font-bold">
          {currency} {price}
        </span>
      </div>
    </div>
  );
}