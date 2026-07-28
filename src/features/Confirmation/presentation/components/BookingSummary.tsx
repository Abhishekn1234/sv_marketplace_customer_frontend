"use client";

import SummaryItem from "./SummaryItem";
import { formatSmartDate } from "../../../../components/utils/formatsmartdate";
import { useLanguage } from "@/features/context/LanguageContext";
import { formatBookingDurationWithTranslation } from "@/features/Bookings/presentation/utils/formatduration";
import { InfoIcon } from "@/components/icons";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import { Booking } from "@/features/Bookings/domain/entities/booking.types";
import CommonCard from "@/components/common/CommonCards";
interface BookingSummaryProps {
  data: Booking;
  placeName: string;
  tierName: string;
}

export default function BookingSummary({
  data,
  placeName,
  tierName,
}: BookingSummaryProps) {
  const { t, isRTLOrder } = useLanguage();
  const { services } = useServices();

  const duration = formatBookingDurationWithTranslation(data, t);

  const serviceId =
    typeof data.serviceId === "string"
      ? data.serviceId
      : data.serviceId?._id;

  const serviceName =
    services?.find((s: any) => String(s._id) === String(serviceId))?.name ||
    (typeof data.serviceId === "object" ? data.serviceId?.name : null) ||
    data.service?.name ||
    "N/A";

  const bookingStatus =
    data.status
      ?.replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase()) || "N/A";

  return (
    <div
      className={`bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg mb-8 ${
        isRTLOrder ? "text-right" : "text-left"
      }`}
    >
      {/* Header */}
      <div className="px-6 py-5 bg-gray-50 border-b-2 border-gray-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          {t.confirmationpage.bookingSummary.title}
        </h3>
      </div>

      {/* Summary */}
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          <SummaryItem
            label={
              t.confirmationpage.bookingSummary.bookingCode || "Booking ID"
            }
            value={data.bookingCode}
            isRTLOrder={isRTLOrder}
          />

          <SummaryItem
            label={t.confirmationpage.bookingSummary.service}
            value={serviceName}
            isRTLOrder={isRTLOrder}
          />

          <SummaryItem
            label={t.confirmationpage.bookingSummary.tier}
            value={tierName}
            isRTLOrder={isRTLOrder}
          />

          <SummaryItem
            label={t.confirmationpage.bookingSummary.status || "Status"}
            value={
              <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {bookingStatus}
              </span>
            }
            isRTLOrder={isRTLOrder}
          />

          <SummaryItem
            label={t.confirmationpage.bookingSummary.timeAndDate}
            value={formatSmartDate(data?.schedule?.startDateTime)}
            isRTLOrder={isRTLOrder}
          />

          <SummaryItem
            label={
              t.confirmationpage.bookingSummary.bookingType || "Booking Type"
            }
            value={
              data.bookingType === "SCHEDULED" ? "Scheduled" : "Instant"
            }
            isRTLOrder={isRTLOrder}
          />

          <SummaryItem
            label={t.confirmationpage.bookingSummary.location}
            value={placeName}
            isRTLOrder={isRTLOrder}
          />

          <SummaryItem
            label={t.confirmationpage.bookingSummary.duration}
            value={duration}
            isRTLOrder={isRTLOrder}
          />

          <SummaryItem
            label={t.confirmationpage.bookingSummary.workers}
            value={data?.numberOfWorkers}
            isRTLOrder={isRTLOrder}
          />

          {data.workDescription && (
            <SummaryItem
              label={
                t.confirmationpage.bookingSummary.workDescription ||
                "Work Description"
              }
              value={data.workDescription}
              isRTLOrder={isRTLOrder}
            />
          )}
        </div>

       
      <div className="mt-8">
        <CommonCard
        title={
          t.confirmationpage.bookingSummary.paymentSummary
        }
        contentClassName="space-y-3 text-sm"
      >
        <div className="flex items-center justify-between">
          <span className="text-gray-500">
            {t.bookingdetailpage.basePrice}
          </span>

          <span className="font-medium">
            {data.currency} {Number(data.amount ?? 0).toFixed(2)}
          </span>
        </div>

        {!!data.discountAmount && (
          <div className="flex items-center justify-between text-green-600">
            <span>
              {t.confirmationpage.bookingSummary.discount }
            </span>

            <span>
              - {data.currency} {Number(data.discountAmount).toFixed(2)}
            </span>
          </div>
        )}

        {data.appliedDiscounts?.[0] && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500">
              {t.confirmationpage.bookingSummary.coupon}
            </span>

            <span className="font-medium">
              {data.appliedDiscounts[0].code}
            </span>
          </div>
        )}

        {!!data.vatAmount && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500">
              {t.confirmationpage.bookingSummary.vat} ({data.vatRate}%)
            </span>

            <span>
              {data.currency} {Number(data.vatAmount).toFixed(2)}
            </span>
          </div>
        )}

        <div className="border-t border-gray-200 pt-3 flex items-center justify-between text-base font-bold">
          <span>
            {t.confirmationpage.bookingSummary.totalPaid}
          </span>

          <span className="text-primary">
            {data.currency} {Number(data.totalCost ?? 0).toFixed(2)}
          </span>
        </div>
      </CommonCard>
      </div>

       
        <div
          className={`mt-8 flex items-start gap-4 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-5 ${
            isRTLOrder ? "flex-row-reverse text-right" : ""
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <InfoIcon />
          </div>

          <div>
            <h4 className="mb-1 text-sm font-bold text-gray-900">
              {t.confirmationpage.bookingSummary.providerAssignmentTitle}
            </h4>

            <p className="text-sm text-gray-600">
              {t.confirmationpage.bookingSummary.providerAssignmentDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}