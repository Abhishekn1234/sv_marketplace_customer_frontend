import React from "react";

import { RecentItem } from "./RecentItem";
import { useServiceCategory } from "@/features/Bookings/presentation/hooks/useServiceCategory";
import { getBookingPrice } from "../../utils/getbookprice";
import { formatDate } from "../../utils/formatdate";
import { useLanguage } from "@/features/context/LanguageContext";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import CommonCard from "@/components/common/CommonCards";

const ACTIVE_STATUSES = new Set([
  "WORKER_ACCEPTED",
  "REQUESTED",
  "IN_PROGRESS",
]);

const CANCELLED_STATUSES = new Set([
  "WORKER_CANCELLED",
  "CUSTOMER_CANCELLED",
]);

const RecentServices: React.FC = () => {
  const { bookings } = useBookings();
  const { data: categories = [] } = useServiceCategory();
  const { t } = useLanguage();

  // =========================
  // MAP: service -> category
  // =========================
  const serviceToCategoryMap = React.useMemo(() => {
    const map = new Map<string, string>();

    categories?.forEach((category: any) => {
      category.services?.forEach((service: any) => {
        map.set(String(service._id), String(category._id));
      });
    });

    return map;
  }, [categories]);

  // =========================
  // MAP: service details
  // =========================
  const serviceMap = React.useMemo(() => {
    const map = new Map<string, any>();

    categories?.forEach((category: any) => {
      category.services?.forEach((service: any) => {
        map.set(String(service._id), service);
      });
    });

    return map;
  }, [categories]);

  // =========================
  // FILTER + SORT BOOKINGS
  // =========================
  const validBookings = React.useMemo(() => {
    if (!bookings?.length) return [];

    return bookings
      .filter((b) => {
        const serviceId = String(b.serviceId?._id ?? b.serviceId ?? "");
        const hasService = serviceMap.has(serviceId);

        const isNotCancelled = !CANCELLED_STATUSES.has(b.status);
        const isActive = ACTIVE_STATUSES.has(b.status);

        return hasService && isNotCancelled && isActive;
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

  if (!validBookings.length) return null;

  // =========================
  // UI
  // =========================
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
          booking.serviceId?._id ?? booking.serviceId ?? ""
        );

        const service = serviceMap.get(serviceId);

        const priceValue = getBookingPrice(booking);

        const price =
          priceValue != null
            ? `${booking.currency ?? ""} ${priceValue}`
            : "";

        const categoryId = serviceToCategoryMap.get(serviceId);

        return (
          <RecentItem
            key={booking._id}
            bookingId={booking._id}
            categoryId={categoryId}
            serviceId={serviceId}
            title={service?.name ?? ""}
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