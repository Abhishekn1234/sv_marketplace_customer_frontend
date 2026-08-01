import { useLanguage } from "@/features/context/LanguageContext";
import CommonCard from "@/components/common/CommonCards";

import { BookingJobprogressinfo } from "../../domain/entities/jobprogresses";
import { formatDuration } from "@/components/utils/formatduration";
import { formatSmartDate } from "@/components/utils/formatsmartdate";
import { formatCoordinates } from "@/components/utils/formatcoordinates";

export function JobProgressInfo({ booking }: BookingJobprogressinfo) {
  const { t,localize } = useLanguage();

  // =========================
  // SERVICE DETAILS
  // =========================
  const serviceName = localize(booking?.service?.name) ?? "N/A";

  const serviceTierName =
    localize(booking?.serviceTier?.displayName) ?? "N/A";

  // =========================
  // PRICE DETAILS
  // =========================
  const total =
    booking?.actualValues?.finalAmount ??
    booking?.estimatedValues?.finalAmount;

  const currency = booking?.currency || "SAR";

  // =========================
  // SERVICE INFO
  // =========================
  const estimatedDuration = formatDuration(booking, t);

  const startDateTime = formatSmartDate(
    booking?.schedule?.startDateTime
  );

  
    const formattedCoordinates = formatCoordinates(
      booking?.location?.coordinates,
      t.common["No data available"] ?? "No data available"
    );

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
              {currency}{" "}
              {booking?.actualValues?.vatAmount ??
                booking?.estimatedValues?.vatAmount}
            </span>
          </div>


          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {t.jobtrackingpage.serviceDetails.basePrice}
            </span>

            <span className="font-medium text-gray-800">
              {currency} {booking?.actualValues?.taxableAmount ?? booking?.estimatedValues?.taxableAmount}
            </span>
          </div>


          <div className="border-t border-dashed border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-gray-900">
                {t.jobtrackingpage.serviceDetails.totalPrice}
              </span>

              <span className="text-xl font-bold text-blue-600">
                {currency} {total}
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
              {startDateTime}
            </div>
          </div>


          <div>
            <div className="text-gray-500 text-[13px]">
              {t.jobprogresspage.duration}
            </div>

            <div className="font-semibold text-gray-900">
              {estimatedDuration}
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