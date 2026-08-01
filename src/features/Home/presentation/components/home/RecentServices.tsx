import React from "react";
import { RecentItem } from "./RecentItem";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import { useLanguage } from "@/features/context/LanguageContext";
import { getBookingPrice } from "../../utils/getbookprice";
import { formatDate } from "../../../../../components/utils/formatdate";
import CommonCard from "@/components/common/CommonCards";

const CANCELLED_STATUSES = new Set([
  "WORKER_CANCELLED",
  "CUSTOMER_CANCELLED",
]);

const RecentServices: React.FC = () => {
  const { bookings } = useBookings();
  const { t, lang, localize } = useLanguage();

  const {
    services = [],
    loading,
    error,
  } = useServices({
    language: lang,
  });

  // =========================
  // MAP: service -> details
  // =========================
  const serviceMap = React.useMemo(() => {
    const map = new Map<string, any>();

    services.forEach((service: any) => {
      map.set(String(service._id), service);
    });

    return map;
  }, [services]);

  // =========================
  // FILTER + SORT BOOKINGS
  // =========================
  const validBookings = React.useMemo(() => {
    if (!bookings?.length) return [];

    return bookings
      .filter((booking) => {
        const serviceId = String(
          typeof booking.serviceId === "object"
            ? booking.serviceId._id
            : booking.serviceId ?? ""
        );

        return (
          serviceMap.has(serviceId) &&
          !CANCELLED_STATUSES.has(booking.status)
        );
      })
      .sort((a, b) => {
        const aTime = a.schedule?.startDateTime
          ? new Date(a.schedule.startDateTime).getTime()
          : 0;

        const bTime = b.schedule?.startDateTime
          ? new Date(b.schedule.startDateTime).getTime()
          : 0;

        return bTime - aTime;
      });
  }, [bookings, serviceMap]);

  if (loading) return null;

  if (error) return null;

  if (!validBookings.length) return null;

  return (
    <CommonCard
      title={
        <div className="flex items-center justify-between w-full">
          <span className="text-[18px] font-bold text-gray-900">
            {t.home.Recent}
          </span>
        </div>
      }
      className="flex flex-col gap-4"
    >
      {validBookings.map((booking) => {
        const serviceId = String(
          typeof booking.serviceId === "object"
            ? booking.serviceId._id
            : booking.serviceId ?? ""
        );

        const service = serviceMap.get(serviceId);

        const priceValue = getBookingPrice(booking);

        const price =
          priceValue != null
            ? `${booking.currency ?? ""} ${priceValue}`
            : "";

        // Supports both populated and plain categoryId
        const categoryId =
          service?.categoryId?._id ??
          service?.categoryId ??
          service?.category?._id ??
          service?.category ??
          "";

        return (
          <RecentItem
            key={booking._id}
            bookingId={booking._id}
            categoryId={categoryId}
            serviceId={serviceId}
            title={localize(service?.name)}
            date={
              booking.bookingType === "SCHEDULED"
                ? formatDate(booking.schedule?.startDateTime)
                : formatDate(booking.updatedAt)
            }
            price={price}
            iconUrl={service?.iconUrl}
            status={booking.status}
          />
        );
      })}
    </CommonCard>
  );
};

export default RecentServices;