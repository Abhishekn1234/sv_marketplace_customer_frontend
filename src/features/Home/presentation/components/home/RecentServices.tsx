import React from "react";

import { RecentItem } from "./RecentItem";
import { useServiceCategory } from "@/features/Bookings/presentation/hooks/useServiceCategory";
import { getBookingPrice } from "../../helpers/getbookprice";
import { formatDate } from "../../helpers/formatdate";
import { useLanguage } from "@/features/context/LanguageContext";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";

const RecentServices: React.FC = () => {
  const { bookings } = useBookings();
  const { data: categories = [] } = useServiceCategory();
  const { t } = useLanguage();

  // -----------------------------
  // normalize bookings safely
  // -----------------------------
  const normalizedBookings = bookings ?? [];

  // -----------------------------
  // category map
  // -----------------------------
  const serviceToCategoryMap = React.useMemo(() => {
  const map = new Map<string, string>();

  categories?.forEach((category: any) => {
    category.services?.forEach((service: any) => {
      map.set(String(service._id), String(category._id));
    });
  });

  return map;
}, [categories]);

 const serviceMap = React.useMemo(() => {
  const map = new Map<string, any>();

  categories?.forEach((category: any) => {
    category.services?.forEach((service: any) => {
      map.set(String(service._id), service);
    });
  });

  return map;
}, [categories]);
  // -----------------------------
  // sort
  // -----------------------------
  const recentBookings = React.useMemo(() => {
  return [...normalizedBookings].sort((a, b) => {
    const aTime = a.schedule?.startDateTime
      ? new Date(a.schedule.startDateTime).getTime()
      : 0;

    const bTime = b.schedule?.startDateTime
      ? new Date(b.schedule.startDateTime).getTime()
      : 0;

    return bTime - aTime;
  });
}, [normalizedBookings]);
  return (
    <aside className="flex flex-col gap-5 top-6">
      <div className="bg-white rounded-[20px] p-6 border border-gray-200">

        <div className="flex items-center justify-between mb-5">
          <span className="text-[18px] font-bold text-gray-900">
            {t.home.Recent}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {recentBookings.length === 0 && (
            <p className="text-sm text-gray-400">
              No recent bookings available
            </p>
          )}

         {recentBookings.map((booking) => {
 const serviceId = String(
  booking.serviceId?._id ?? booking.serviceId ?? ""
);

  const service = serviceMap.get(serviceId || "");

  const serviceName = service?.name ?? "";
  const iconUrl = service?.iconUrl;

  const priceValue = getBookingPrice(booking);

  const price =
    priceValue != null
      ? `${booking.currency ?? ""} ${priceValue}`
      : "";

  const categoryId = serviceToCategoryMap.get(serviceId || "");

  return (
    <RecentItem
      key={booking._id}
      bookingId={booking._id}
      categoryId={categoryId}
      serviceId={serviceId}
      title={serviceName}
      date={
        booking.bookingType === "SCHEDULED"
          ? formatDate(booking.schedule?.startDateTime)
          : formatDate(booking.updatedAt)
      }
      price={price}
      iconUrl={iconUrl}
      status={booking.status}
    />
  );
})}
        </div>
      </div>
    </aside>
  );
};

export default RecentServices;